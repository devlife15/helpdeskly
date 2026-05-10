import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { MessageDoc, saveMessage } from "@convex-dev/agent";
import { components } from "../_generated/api";
import { paginationOptsValidator } from "convex/server";

export const getMany = query({
  args: {
    contactSessionId: v.id("contactSessions"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);

    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid Session!",
      });
    }

    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_contactSession_Id", (q) =>
        q.eq("contactSessionId", args.contactSessionId),
      )
      .order("desc")
      .paginate(args.paginationOpts);

    const conversationsWithLastMessage = await Promise.all(
      conversations.page.map(async (conversations) => {
        let lastMessage: MessageDoc | null = null;

        const messages = await supportAgent.listMessages(ctx, {
          threadId: conversations.threadId,
          paginationOpts: {
            numItems: 1,
            cursor: null,
          },
        });

        if (messages.page.length > 0) {
          lastMessage = messages.page[0] ?? null;
        }

        return {
          _id: conversations._id,
          _creationTime: conversations._creationTime,
          status: conversations.status,
          organizationId: conversations.organizationId,
          threadId: conversations.threadId,
          lastMessage,
        };
      }),
    );

    return {
      ...conversations,
      page: conversationsWithLastMessage,
    };
  },
});

export const getOne = query({
  args: {
    conversationId: v.id("conversations"),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.contactSessionId);

    if (!session || session.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid Session!",
      });
    }

    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation) null;

    if (conversation?.contactSessionId !== session._id) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Incorrect Session!",
      });
    }

    return {
      _id: conversation?._id,
      status: conversation?.status,
      threadId: conversation?.threadId,
    };
  },
});

export const create = mutation({
  args: {
    organizationId: v.string(),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.contactSessionId);

    if (!session || session.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid Session!",
      });
    }

    const { threadId } = await supportAgent.createThread(ctx, {
      userId: args.organizationId,
    });

    await saveMessage(ctx, components.agent, {
      threadId,
      message: {
        role: "assistant",
        //todo: later modify to widget settings initial message
        content: "Hello, How Can I Help You Today?",
      },
    });

    const conversationId = await ctx.db.insert("conversations", {
      contactSessionId: session._id,
      status: "unresolved",
      organizationId: args.organizationId,
      threadId,
    });

    return conversationId;
  },
});
