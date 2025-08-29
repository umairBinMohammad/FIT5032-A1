const activities = [
  { id: 1, name: 'Community Soccer (Mixed)', location: 'Carlton', level: 'Beginner', age: '12+', accessibility: 'Wheelchair-friendly' },
  { id: 2, name: 'Basketball Social Night', location: 'Brunswick', level: 'Intermediate', age: '16+', accessibility: 'Hearing assistance' },
  { id: 3, name: 'Yoga in the Park', location: 'Fitzroy', level: 'All Levels', age: '12+', accessibility: 'Quiet space' },
  { id: 4, name: 'Walking Club', location: 'Docklands', level: 'Beginner', age: '50+', accessibility: 'Low-impact routes' },
  { id: 5, name: 'Tennis Drills', location: 'South Yarra', level: 'Advanced', age: '16+', accessibility: 'Accessible courts' },
];

export function fetchActivities() {
  return new Promise(resolve => setTimeout(() => resolve(activities), 350));
}
