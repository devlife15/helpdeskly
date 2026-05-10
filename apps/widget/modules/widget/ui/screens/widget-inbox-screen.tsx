"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { WidgetHeader } from "../components/widget-header";
import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  organizationAtom,
  screenAtom,
} from "../../atoms/widget-atoms";
import { ArrowLeftIcon } from "lucide-react";
import { WidgetFooter } from "../components/widget-footer";
import { Button } from "@workspace/ui/components/button";
import { usePaginatedQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

export const WidgetInboxScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);
  const organizationId = useAtomValue(organizationAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || ""),
  );

  const conversations = usePaginatedQuery(
    api.public.conversations.getMany,
    contactSessionId ? { contactSessionId } : "skip",
    { initialNumItems: 10 },
  );
  return (
    <>
      <WidgetHeader>
        <div className="flex items-center gap-x-2">
          <Button
            variant="transparent"
            size="icon"
            onClick={() => setScreen("selection")}
          >
            <ArrowLeftIcon />
          </Button>
          <p>Inbox</p>
        </div>
      </WidgetHeader>

      <div className="flex flex-col flex-1 gap-y-2 p-4 overflow-y-auto">
        {conversations?.results.length > 0 &&
          conversations?.results.map((conversation) => (
            <Button
              className="h-20 w-full justify-between"
              key={conversation._id}
              onClick={() => {
                setConversationId(conversation._id);
                setScreen("chat");
              }}
            ></Button>
          ))}
      </div>
      <WidgetFooter />
    </>
  );
};
