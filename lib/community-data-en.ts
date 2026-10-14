import type { BoardPost, HyroxEvent } from './community-data'

type EventEn = Pick<HyroxEvent, 'name' | 'city' | 'country' | 'venue'>

const EVENTS_EN: Record<string, Partial<EventEn>> = {
  'hyrox-incheon-2025': { city: 'Incheon', country: 'South Korea', venue: 'Songdo Convensia, Yeonsu-gu' },
  'hyrox-seoul-2025': { name: 'HYROX Seoul 2025 (first Seoul edition, Nov 8–9)', city: 'Seoul', country: 'South Korea', venue: 'COEX, Gangnam-gu' },
  'hyrox-incheon-2026': { city: 'Incheon', country: 'South Korea', venue: 'Songdo Convensia, Yeonsu-gu' },
  'hyrox-seoul-2026': { name: 'HYROX Seoul 2026 (Nov 13–15)', city: 'Seoul', country: 'South Korea', venue: 'KINTEX, Goyang-si' },
  'hyrox-incheon-2027': { city: 'Incheon', country: 'South Korea', venue: 'Songdo Convensia, Yeonsu-gu' },
}

export function localizeEvent(event: HyroxEvent, locale: string): HyroxEvent {
  if (locale !== 'en') return event
  const own: Partial<EventEn> = {}
  if (event.cityEn) own.city = event.cityEn
  if (event.countryEn) own.country = event.countryEn
  return { ...event, ...own, ...(EVENTS_EN[event.id] ?? {}) }
}

type PostEn = Pick<BoardPost, 'title' | 'content' | 'author' | 'tags'>

const POSTS_EN: Record<string, PostEn> = {
  'post-1': {
    title: 'I finally got a sub-5 Fran!',
    content: "After six months of steady practice I finally broke 5 minutes on Fran: 4:52 with 43 kg thrusters! At first even 30 kg was hard, let alone 60 kg... consistency really is the answer. Next goal: sub-4!",
    author: 'GangnamCrossFitter', tags: ['Fran', 'PR', 'Thruster'],
  },
  'post-2': {
    title: 'First ring muscle-up! Sharing my tips',
    content: "After three months of practice I finally got my first ring muscle-up! Key tips: 1) Have 20+ pull-ups before you try 2) Practice the false grip religiously 3) Pull the elbows back fast in the dip. I think I did over 300 negative muscle-ups.",
    author: 'CrossFitNewbie', tags: ['Ring Muscle-up', 'Technique tips', 'Rings'],
  },
  'post-3': {
    title: 'HYROX Seoul 2025 race report (first timer)',
    content: "I finished my first HYROX! It was much harder than I expected. The SkiErg → Sled Push section was a leg killer... I trained for 3 months and finished in 1:52. Next time I'm aiming for 1:30. Anyone want to race together?",
    author: 'FirstTimeHyrox', tags: ['HYROX', 'Race report', 'First race'],
  },
  'post-4': {
    title: 'Drop-in etiquette for CrossFit boxes',
    content: "I've dropped in at a lot of boxes while traveling, so here are a few tips: 1) Book ahead 2) Arrive 15 minutes before class 3) Greet the coach first 4) Ask how to use the equipment 5) Put equipment away after the WOD. Basic manners will get you a warm welcome!",
    author: 'DropInPro', tags: ['Drop-in', 'Etiquette', 'Travel'],
  },
  'post-5': {
    title: 'My 3-month routine for a sub-40 Murph',
    content: "My goal is a sub-40 Murph this Memorial Day. Currently at 54 minutes... Tuesdays and Thursdays are running intervals, Mon/Wed/Fri are pull-up and push-up volume. I'll first get to 45 minutes without the vest, then try with the vest. Anyone training for it too?",
    author: 'MurphHunter', tags: ['Murph', 'Goal setting', 'Training routine'],
  },
  'post-6': {
    title: '100 unbroken double-unders at last!',
    content: "Four months after picking up the jump rope I hit 100 unbroken double-unders! At first I couldn't even string together 3... The keys are wrist snap, consistent jump height and rhythm. I practiced 15 minutes every day. I feel confident about Annie now too.",
    author: 'RopeMaster', tags: ['Double-Under', 'Jump rope', 'Technique'],
  },
  'post-7': {
    title: 'My body change after one year of CrossFit',
    content: "One year ago: 80 kg, 28% body fat, 60 kg deadlift. Now: 74 kg, 15% body fat, 120 kg deadlift. Losing weight wasn't even my goal, but my body completely changed. I barely changed my diet, just did WODs four times a week. CrossFit really works.",
    author: 'LivingProof', tags: ['Body change', 'One year update', 'Weight loss'],
  },
  'post-8': {
    title: 'Drills I recommend for improving your snatch',
    content: "For anyone learning the snatch: 1) Build overhead squat stability first 2) 100 snatch-grip deadlifts a week 3) Repeat hang snatch positions 4) Snatch balance 5) Box snatch. Drop the ego and use a PVC pipe for three months. Your technique will be completely different.",
    author: 'SnatchCoach', tags: ['Snatch', 'Technique', 'Drills'],
  },
  'post-9': {
    title: 'How do you film your workouts?',
    content: "I want to film my WODs for my records, but how do you set up when training alone? I'm wondering about tripod angles, camera position and so on. I heard barbell movements are best filmed from the side... I want form feedback from my coach.",
    author: 'VideoLogger', tags: ['Filming', 'Logging', 'Feedback'],
  },
  'post-10': {
    title: 'Cheering on our athletes at the 2026 CrossFit Games',
    content: "I heard three Korean athletes are heading to the CrossFit Games this year! I get so motivated watching the Games, and having Korean athletes there makes it even better. Let's cheer them on together here!",
    author: 'CrossFitFan', tags: ['CrossFitGames', 'Cheering', 'Korean athletes'],
  },
  'post-11': {
    title: 'What matters most when choosing a box?',
    content: "I'm looking for a new box after moving. Coaching quality vs facilities vs location vs price vs atmosphere... what do you value most? I think coaching quality matters most, but how did you all choose?",
    author: 'BoxHunter', tags: ['Choosing a box', 'Advice', 'Community'],
  },
  'post-12': {
    title: 'My first Isabel (30 snatches) finish',
    content: "I tried Isabel for the first time today and it was brutal. I started with 43 kg and dropped to 30 kg halfway through. Still, finishing was the goal, so I'm happy! Next time I want to finish with 43 kg. My snatch technique still needs work.",
    author: 'SnatchJourney', tags: ['Isabel', 'WOD report', 'Snatch'],
  },
  'post-13': {
    title: 'My injury-prevention stretching routine',
    content: "After taking six months off with a shoulder injury two years ago, I take warm-ups seriously. My daily routine: foam-roller thoracic spine 10 minutes + band shoulder warm-up 5 minutes + hip mobility 5 minutes. I never skip it. Prevention is the best cure.",
    author: 'InjuryPreventionPreacher', tags: ['Injury prevention', 'Stretching', 'Conditioning'],
  },
  'post-14': {
    title: 'HYROX vs CrossFit: which suits me better?',
    content: "Looking for opinions from people who've done both. I've done CrossFit for a year and got interested in HYROX. CrossFit has workout variety, while HYROX feels like it has a clear goal? Does anyone do both?",
    author: 'CuriousAboutBoth', tags: ['HYROX', 'CrossFit', 'Comparison'],
  },
  'post-15': {
    title: "Today's WOD: 25 rounds of Cindy!",
    content: "Three years after joining my box I hit 25 rounds of Cindy! At first even 8 rounds was hard... just keep at it. Cindy has clear standards, so it's a great way to measure fitness. Next goal is 30 rounds. Did anyone else do Cindy today?",
    author: 'CindyKing', tags: ['Cindy', 'PR', 'AMRAP'],
  },
}

export function localizePost(post: BoardPost, locale: string): BoardPost {
  if (locale !== 'en') return post
  const en = POSTS_EN[post.id]
  return en ? { ...post, ...en } : post
}
