import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Video, Calendar } from 'lucide-react';
import { EScreen } from '../employeeData';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

type EventType = 'task' | 'workflow' | 'meeting' | 'reminder';

interface CalEvent {
  id: string; title: string; date: number; time?: string;
  type: EventType; desc?: string; location?: string; agent?: string;
  duration?: string;
}

const eventConfig: Record<EventType, { color: string; bg: string; dotColor: string }> = {
  task:     { color: '#EF4444', bg: 'bg-red-50',    dotColor: 'bg-red-500' },
  workflow: { color: '#5C5FEF', bg: 'bg-indigo-50', dotColor: 'bg-indigo-500' },
  meeting:  { color: '#10B981', bg: 'bg-green-50',  dotColor: 'bg-green-500' },
  reminder: { color: '#F59E0B', bg: 'bg-yellow-50', dotColor: 'bg-yellow-500' },
};

const events: CalEvent[] = [
  { id: 'ev-1', title: 'Review TechCorp Proposal', date: 2, time: '5:00 PM', type: 'task', desc: 'Sales\'s draft ready for review.', agent: 'Sales', duration: '30 min' },
  { id: 'ev-2', title: 'InnovateCo Discount Deadline', date: 2, time: 'All day', type: 'task', desc: 'Approval overdue — deal at risk.', agent: 'Sales' },
  { id: 'ev-3', title: 'BlueStar Renewal Call', date: 3, time: '10:00 AM', type: 'meeting', desc: 'Discuss renewal terms with BlueStar account team.', location: 'Zoom', duration: '45 min' },
  { id: 'ev-4', title: 'TechCorp Onboarding Kickoff', date: 4, time: '2:00 PM', type: 'meeting', desc: 'Kickoff with TechCorp success team. Agenda prepared by Command.', location: 'Google Meet', agent: 'Command', duration: '60 min' },
  { id: 'ev-5', title: 'TechCorp Onboarding Workflow', date: 4, time: '9:00 AM', type: 'workflow', desc: 'Command starts the full onboarding workflow.', agent: 'Command' },
  { id: 'ev-6', title: 'Weekly Sales Report Due', date: 5, time: '9:00 AM', type: 'task', desc: 'Q3 Pipeline report for leadership review.', agent: 'Sales' },
  { id: 'ev-7', title: 'Pipeline Report Auto-generation', date: 5, time: '7:00 AM', type: 'workflow', desc: 'Sales auto-generates weekly pipeline report from HubSpot.', agent: 'Sales' },
  { id: 'ev-8', title: 'Q3 Competitive Review', date: 6, time: '5:00 PM', type: 'task', desc: 'Review and share Marketing\'s competitive analysis.', agent: 'Marketing' },
  { id: 'ev-9', title: 'Team Sync', date: 8, time: '10:00 AM', type: 'meeting', desc: 'Weekly sales team sync. Agenda auto-shared by Command.', location: 'Zoom', duration: '30 min' },
  { id: 'ev-10', title: 'Q3 Strategy Session', date: 12, time: '2:00 PM', type: 'meeting', desc: 'Quarterly sales strategy planning session.', location: 'Conference Room A', duration: '2 hr' },
  { id: 'ev-11', title: 'Customer Success Review', date: 15, time: '11:00 AM', type: 'meeting', desc: 'Monthly CS review with account team.', location: 'Zoom', duration: '45 min' },
  { id: 'ev-12', title: 'Submit Expense Report', date: 30, time: '5:00 PM', type: 'reminder', desc: 'Monthly expense report deadline.' },
];

interface ECalendarScreenProps {
  onNavigate: (screen: EScreen) => void;
}

export function ECalendarScreen({ onNavigate }: ECalendarScreenProps) {
  const [year] = useState(2026);
  const [month] = useState(5); // June (0-indexed)
  const [selectedDay, setSelectedDay] = useState<number | null>(2);
  const today = 2;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: firstDay }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  const eventsByDay: Record<number, CalEvent[]> = {};
  events.forEach(e => {
    if (!eventsByDay[e.date]) eventsByDay[e.date] = [];
    eventsByDay[e.date].push(e);
  });

  const dayEvents = selectedDay ? (eventsByDay[selectedDay] || []) : [];
  const upcoming = events.filter(e => e.date >= today).sort((a, b) => a.date - b.date).slice(0, 6);

  return (
    <div className="h-full flex overflow-hidden bg-background">
      {/* Calendar main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-border flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-semibold text-foreground">{MONTHS[month]} {year}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{events.length} events this month</span>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 bg-white border-b border-border flex-shrink-0">
          {DAYS.map(d => (
            <div key={d} className="py-2.5 text-center text-xs font-semibold text-muted-foreground">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-7 border-l border-border">
            {cells.map((day, i) => {
              const dayEvs = day ? (eventsByDay[day] || []) : [];
              const isToday = day === today;
              const isSelected = day === selectedDay;
              return (
                <div
                  key={i}
                  onClick={() => day && setSelectedDay(day)}
                  className={`min-h-24 p-2 border-r border-b border-border transition-colors ${day ? 'cursor-pointer hover:bg-muted/20' : ''} ${isSelected ? 'bg-primary/5' : 'bg-white'}`}
                >
                  {day && (
                    <>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm mb-1.5 ${isToday ? 'bg-primary text-white font-semibold' : isSelected ? 'border-2 border-primary text-primary font-medium' : 'text-foreground'}`}>
                        {day}
                      </div>
                      <div className="space-y-0.5">
                        {dayEvs.slice(0, 2).map(ev => (
                          <div key={ev.id} className={`text-xs px-1.5 py-0.5 rounded-md truncate ${eventConfig[ev.type].bg}`} style={{ color: eventConfig[ev.type].color }}>
                            {ev.time && ev.time !== 'All day' ? `${ev.time} ` : ''}{ev.title}
                          </div>
                        ))}
                        {dayEvs.length > 2 && (
                          <div className="text-xs text-muted-foreground px-1">+{dayEvs.length - 2} more</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right panel: Selected day + Upcoming */}
      <div className="w-72 flex-shrink-0 border-l border-border bg-white flex flex-col overflow-hidden">
        {/* Selected day */}
        {selectedDay && (
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-3.5 border-b border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {DAYS[new Date(year, month, selectedDay).getDay()]}, {MONTHS[month]} {selectedDay}
              </p>
              <p className="text-sm font-medium text-foreground">{dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="divide-y divide-border">
              {dayEvents.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <Calendar className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No events this day</p>
                </div>
              ) : dayEvents.map(ev => (
                <div key={ev.id} className="p-4">
                  <div className="flex items-start gap-2.5">
                    <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${eventConfig[ev.type].dotColor}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{ev.title}</p>
                      {ev.time && <p className="text-xs text-muted-foreground">{ev.time}{ev.duration ? ` · ${ev.duration}` : ''}</p>}
                      {ev.desc && <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{ev.desc}</p>}
                      {ev.location && (
                        <div className="flex items-center gap-1 mt-1.5 text-xs text-primary">
                          <Video className="w-3 h-3" />
                          {ev.location}
                        </div>
                      )}
                      {ev.agent && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          via {ev.agent}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming events */}
        <div className="border-t border-border">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Upcoming</p>
          </div>
          <div className="divide-y divide-border max-h-64 overflow-y-auto">
            {upcoming.map(ev => (
              <div key={ev.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => setSelectedDay(ev.date)}>
                <div className="text-center flex-shrink-0 w-8">
                  <p className="text-xs text-muted-foreground">{DAYS[new Date(year, month, ev.date).getDay()]}</p>
                  <p className="text-sm font-semibold text-foreground">{ev.date}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{ev.title}</p>
                  <p className="text-xs text-muted-foreground">{ev.time}</p>
                </div>
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${eventConfig[ev.type].dotColor}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
