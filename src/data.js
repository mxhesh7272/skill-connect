export const skills = {
  technical: ['Python', 'Web Development', 'UI/UX', 'AI / ML', 'Data Science', 'Java', 'C++', 'Cloud'],
  nonTechnical: ['Public Speaking', 'Photography', 'Video Editing', 'Cooking', 'Communication', 'Leadership', 'Music', 'Content Creation']
};

export const people = [
  { id: 'priya', name: 'Priya Sharma', initials: 'PS', color: '#6956e8', dept: 'Computer Engineering', year: 'Third Year', bio: 'Designing thoughtful digital products and learning Python one project at a time.', teaches: ['UI/UX', 'Photography'], learns: ['Python'], match: 94, availability: 'Online · Available today', rating: 4.9, sessions: 18, communities: ['UI / UX Circle', 'Photography'] },
  { id: 'rahul', name: 'Rahul Patil', initials: 'RP', color: '#df7046', dept: 'Information Technology', year: 'Final Year', bio: 'Python mentor, open-source explorer, and patient problem solver.', teaches: ['Python', 'Data Science'], learns: ['Public Speaking'], match: 91, availability: 'Both · Free weekends', rating: 4.8, sessions: 27, communities: ['Python', 'AI / ML'] },
  { id: 'aisha', name: 'Aisha Khan', initials: 'AK', color: '#1c9a83', dept: 'Electronics & Telecommunication', year: 'Second Year', bio: 'I make stories move through video and love meeting curious people.', teaches: ['Video Editing', 'Content Creation'], learns: ['Web Development'], match: 88, availability: 'Offline · Campus library', rating: 4.7, sessions: 11, communities: ['Photography', 'Creative Lab'] },
  { id: 'rohan', name: 'Rohan Deshmukh', initials: 'RD', color: '#3c7be0', dept: 'Computer Engineering', year: 'Third Year', bio: 'Building small tools, playing guitar and always learning.', teaches: ['Web Development', 'Music'], learns: ['UI/UX'], match: 86, availability: 'Online · Evenings', rating: 4.6, sessions: 9, communities: ['Web Development', 'Music Room'] },
  { id: 'sneha', name: 'Sneha Kulkarni', initials: 'SK', color: '#c26ab1', dept: 'MBA', year: 'First Year', bio: 'A confident communicator with a soft spot for emerging tech.', teaches: ['Public Speaking', 'Leadership'], learns: ['AI / ML'], match: 84, availability: 'Offline · Available Friday', rating: 4.8, sessions: 15, communities: ['Public Speaking', 'Leadership'] },
  { id: 'vivek', name: 'Vivek Joshi', initials: 'VJ', color: '#667681', dept: 'Information Technology', year: 'Second Year', bio: 'Cloud learner and community-first builder.', teaches: ['Cloud', 'Java'], learns: ['Photography'], match: 82, availability: 'Both · Afternoons', rating: 4.5, sessions: 7, communities: ['Cloud', 'Java'] },
  { id: 'neha', name: 'Neha Pawar', initials: 'NP', color: '#d27b4c', dept: 'Computer Engineering', year: 'Final Year', bio: 'Machine learning student who enjoys explaining complex ideas simply.', teaches: ['AI / ML', 'Data Science'], learns: ['Music'], match: 81, availability: 'Online · Weekdays', rating: 4.9, sessions: 21, communities: ['AI / ML', 'Python'] },
  { id: 'om', name: 'Om Bhosale', initials: 'OB', color: '#6b58d7', dept: 'Mechanical Engineering', year: 'Third Year', bio: 'Design thinker, maker and regular campus volunteer.', teaches: ['UI/UX', 'Leadership'], learns: ['C++'], match: 79, availability: 'Offline · Innovation Lab', rating: 4.6, sessions: 10, communities: ['UI / UX Circle', 'Leadership'] },
  { id: 'kavya', name: 'Kavya More', initials: 'KM', color: '#db6d88', dept: 'Electronics & Telecommunication', year: 'Second Year', bio: 'I document campus life through a camera lens.', teaches: ['Photography', 'Video Editing'], learns: ['Python'], match: 77, availability: 'Offline · Mornings', rating: 4.7, sessions: 8, communities: ['Photography', 'Creative Lab'] },
  { id: 'arjun', name: 'Arjun Kale', initials: 'AK', color: '#478bcb', dept: 'Computer Engineering', year: 'First Year', bio: 'Starting out in code, showing up with questions and energy.', teaches: ['Content Creation', 'Communication'], learns: ['Web Development'], match: 75, availability: 'Online · Nights', rating: 4.4, sessions: 4, communities: ['Web Development', 'Public Speaking'] }
];

export const communities = [
  { id: 'python', name: 'Python', members: '1,248', online: 127, topic: 'Python Projects', category: 'Technical', color: '#4979ec' },
  { id: 'web-development', name: 'Web Development', members: '982', online: 84, topic: 'Portfolio reviews', category: 'Technical', color: '#8b5cf6' },
  { id: 'ai-ml', name: 'AI / ML', members: '756', online: 66, topic: 'Beginner ML roadmap', category: 'Technical', color: '#0f9d8a' },
  { id: 'ui-ux', name: 'UI/UX', members: '614', online: 51, topic: 'Design critique', category: 'Technical', color: '#dc679d' },
  { id: 'photography', name: 'Photography', members: '482', online: 39, topic: 'Monsoon photo walk', category: 'Non-Technical', color: '#d6783a' },
  { id: 'public-speaking', name: 'Public Speaking', members: '392', online: 31, topic: 'Pitch practice', category: 'Non-Technical', color: '#e06068' }
];

export const initialSessions = [
  { id: 1, skill: 'Python Fundamentals', teacher: 'Rahul Patil', day: 'Today', date: 'Aug 13', time: '4:00 PM', mode: 'Online', place: 'Meet link', seats: 18, capacity: 20, type: 'Technical' },
  { id: 2, skill: 'UI/UX Workshop', teacher: 'Priya Sharma', day: 'Tomorrow', date: 'Aug 14', time: '5:30 PM', mode: 'Offline', place: 'Innovation Lab 2', seats: 12, capacity: 16, type: 'Technical' },
  { id: 3, skill: 'Camera Basics Walk', teacher: 'Aisha Khan', day: 'Saturday', date: 'Aug 16', time: '7:00 AM', mode: 'Offline', place: 'Main Gate', seats: 9, capacity: 12, type: 'Non-Technical' }
];
