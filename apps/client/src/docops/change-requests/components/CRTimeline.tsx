import { Stack, Text, Timeline } from "@mantine/core";
import {
  IconCheck,
  IconGitBranch,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import type { CrEvent } from "../types/cr.types";

function eventIcon(toStatus: string) {
  if (toStatus === 'PUBLISHED') return <IconCheck size={14} />;
  if (toStatus === 'CLOSED') return <IconX size={14} />;
  return <IconGitBranch size={14} />;
}

function eventColor(toStatus: string): string {
  if (toStatus === 'PUBLISHED') return 'green';
  if (toStatus === 'CLOSED') return 'red';
  if (toStatus === 'IN_VERIFICATION') return 'violet';
  if (toStatus === 'IN_PROGRESS') return 'orange';
  return 'blue';
}

interface CRTimelineProps {
  events: CrEvent[];
  createdAt?: string;
}

export function CRTimeline({ events, createdAt }: CRTimelineProps) {
  const { t } = useTranslation();
  const totalItems = 1 + events.length;

  return (
    <Timeline active={totalItems - 1} bulletSize={24} lineWidth={2}>
      <Timeline.Item
        bullet={<IconPlus size={14} />}
        color="blue"
        title={
          <Text size="sm" fw={500}>
            {t("CR aperta")}
          </Text>
        }
      >
        {createdAt && (
          <Text size="xs" c="dimmed">
            {new Date(createdAt).toLocaleString()}
          </Text>
        )}
      </Timeline.Item>

      {events.map((ev) => (
        <Timeline.Item
          key={ev.id}
          bullet={eventIcon(ev.toStatus)}
          color={eventColor(ev.toStatus)}
          title={
            <Text size="sm" fw={500}>
              {ev.fromStatus ? `${t(ev.fromStatus)} → ${t(ev.toStatus)}` : t(ev.toStatus)}
            </Text>
          }
        >
          <Stack gap={2}>
            {ev.reason && (
              <Text size="xs" c="dimmed" fs="italic">
                "{ev.reason}"
              </Text>
            )}
            <Text size="xs" c="dimmed">
              {new Date(ev.createdAt).toLocaleString()}
            </Text>
          </Stack>
        </Timeline.Item>
      ))}
    </Timeline>
  );
}
