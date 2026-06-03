import { Stack, Text, Timeline } from "@mantine/core";
import {
  IconCheck,
  IconClock,
  IconCode,
  IconEye,
  IconGitBranch,
  IconX,
} from "@tabler/icons-react";
import type { CrEvent, CrStatus } from "../types/cr.types";

const STEP_LABELS: Record<CrStatus, string> = {
  IN_REVIEW: 'CR aperta',
  IN_VERIFICATION: 'In verifica',
  IN_PROGRESS: 'In implementazione',
  PUBLISHED: 'Pubblicata',
  CLOSED: 'Chiusa',
};

const HAPPY_PATH: CrStatus[] = ['IN_REVIEW', 'IN_VERIFICATION', 'IN_PROGRESS', 'PUBLISHED'];

function stepIcon(status: CrStatus, done: boolean) {
  if (!done) return <IconClock size={14} />;
  if (status === 'PUBLISHED') return <IconCheck size={14} />;
  if (status === 'CLOSED') return <IconX size={14} />;
  if (status === 'IN_PROGRESS') return <IconCode size={14} />;
  if (status === 'IN_VERIFICATION') return <IconEye size={14} />;
  return <IconGitBranch size={14} />;
}

function stepColor(status: CrStatus, done: boolean): string {
  if (!done) return 'gray';
  if (status === 'PUBLISHED') return 'green';
  if (status === 'CLOSED') return 'red';
  if (status === 'IN_VERIFICATION') return 'violet';
  if (status === 'IN_PROGRESS') return 'orange';
  return 'blue';
}

interface CRTimelineProps {
  events: CrEvent[];
  createdAt?: string;
  currentStatus: CrStatus;
}

export function CRTimeline({ events, createdAt, currentStatus }: CRTimelineProps) {
  const isClosed = currentStatus === 'CLOSED';
  const steps: CrStatus[] = isClosed ? [...HAPPY_PATH, 'CLOSED'] : HAPPY_PATH;

  function isDone(step: CrStatus): boolean {
    if (step === 'IN_REVIEW') return true;
    if (step === 'CLOSED') return isClosed;
    return events.some((e) => e.toStatus === step);
  }

  function getTimestamp(step: CrStatus): string | undefined {
    if (step === 'IN_REVIEW') return createdAt;
    return events.find((e) => e.toStatus === step)?.createdAt;
  }

  function getReason(step: CrStatus): string | undefined {
    return events.find((e) => e.toStatus === step)?.reason ?? undefined;
  }

  const doneCount = steps.filter(isDone).length;

  return (
    <Timeline active={doneCount - 1} bulletSize={24} lineWidth={2}>
      {steps.map((step) => {
        const done = isDone(step);
        const ts = getTimestamp(step);
        const reason = getReason(step);

        return (
          <Timeline.Item
            key={step}
            bullet={stepIcon(step, done)}
            color={stepColor(step, done)}
            title={
              <Text size="sm" fw={500} c={done ? undefined : 'dimmed'}>
                {STEP_LABELS[step]}
              </Text>
            }
          >
            <Stack gap={2}>
              {reason && (
                <Text size="xs" c="dimmed" fs="italic">
                  "{reason}"
                </Text>
              )}
              {ts && (
                <Text size="xs" c="dimmed">
                  {new Date(ts).toLocaleString()}
                </Text>
              )}
            </Stack>
          </Timeline.Item>
        );
      })}
    </Timeline>
  );
}
