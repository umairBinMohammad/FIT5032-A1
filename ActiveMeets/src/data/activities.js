// Added approximate coordinates around Melbourne suburbs
const activities = [
  { id: 1, name: 'Community Soccer (Mixed)', location: 'Carlton', level: 'Beginner', age: '12+', accessibility: 'Wheelchair-friendly', lat: -37.8006, lng: 144.9661 },
  { id: 2, name: 'Basketball Social Night', location: 'Brunswick', level: 'Intermediate', age: '16+', accessibility: 'Hearing assistance', lat: -37.7675, lng: 144.9616 },
  { id: 3, name: 'Yoga in the Park', location: 'Fitzroy', level: 'All Levels', age: '12+', accessibility: 'Quiet space', lat: -37.7982, lng: 144.9787 },
  { id: 4, name: 'Walking Club', location: 'Docklands', level: 'Beginner', age: '50+', accessibility: 'Low-impact routes', lat: -37.8163, lng: 144.9460 },
  { id: 5, name: 'Tennis Drills', location: 'South Yarra', level: 'Advanced', age: '16+', accessibility: 'Accessible courts', lat: -37.8393, lng: 144.9970 },
];

export function fetchActivities() {
  return new Promise(resolve => setTimeout(() => resolve(activities), 350));
}
