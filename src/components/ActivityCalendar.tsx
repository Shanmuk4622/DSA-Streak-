'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ActivityCalendarProps {
  data: {
    day: string;
    solve_count: number;
  }[];
}

export const ActivityCalendar: React.FC<ActivityCalendarProps> = ({ data }) => {
  const getActivityLevel = (count: number) => {
    if (count === 0) return 'activity-0';
    if (count <= 2) return 'activity-1';
    if (count <= 5) return 'activity-2';
    if (count <= 10) return 'activity-3';
    return 'activity-4';
  };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-4">Activity Calendar</h2>
      <div className="calendar-container">
        {data.map(({ day, solve_count }) => (
          <TooltipProvider key={day}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`calendar-day ${getActivityLevel(solve_count)}`} />
              </TooltipTrigger>
              <TooltipContent>
                <p>{`${solve_count} solves on ${day}`}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};