import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { supportAgent } from "../system/ai/supportAgent";

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

    const conversationId = await ctx.db.insert("conversations", {
      contactSessionId: session._id,
      status: "unresolved",
      organizationId: args.organizationId,
      threadId,
    });

    return conversationId;
  },
});
