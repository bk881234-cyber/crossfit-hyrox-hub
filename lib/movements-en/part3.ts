import type { MovementEn } from './types'

export const MOVEMENTS_EN_PART3: Record<string, MovementEn> = {
  'wall-ball': {
    equipment: ['Medicine ball', 'Wall'],
    primaryMuscles: ['Quadriceps', 'Glutes', 'Deltoids', 'Core'],
    overview: `The wall ball is a compound exercise in which you hold a medicine ball, squat, and then throw the ball to a target on the wall. Like the thruster, it is a full-body movement that combines explosive lower-body power with upper-body pressing ability.

"Karen" (150 wall balls) is considered one of the most painful benchmark WODs in CrossFit, and shows just how effective this single movement is for whole-body metabolic conditioning. The RX standard is a 20 lb (about 9 kg) ball to a 10 ft (3 m) target for men, and a 14 lb (about 6.3 kg) ball to a 9 ft (2.7 m) target for women.

The start position is holding the ball at the chest, standing about 30–60 cm from the wall. Perform a full-depth squat the same way you would an air squat, then use the momentum of standing up to throw the ball overhead. The explosive force of the legs determines the height of the ball, so it is important to use the whole body rather than throwing with the arms alone.

After throwing, immediately transition into the next squat position as the ball comes down. Catching the ball and dropping straight into the bottom of the squat to keep a continuous rhythm is the key to high-rep wall balls.

The wall ball trains hip drive, core stability, and timing all at once, and also gives a big stimulus to the cardiorespiratory system.`,
    technicalStandards: [
      'Hold the ball at the chest and stand 30–60 cm from the wall',
      'Perform a full-depth squat (hip crease below the knee)',
      'Use the momentum of the squat drive to throw the ball up',
      'Hit the target (men 10 ft / women 9 ft) with the ball',
      'Catch the ball on the way down and flow into the next squat',
      'Maintain a continuous rhythm to maximize energy efficiency',
    ],
    commonFaults: [
      'Throwing with the arms only: no leg drive, so the arms fatigue quickly',
      'Incomplete squat depth: the hips only reach knee height, reducing muscle activation',
      'Holding the ball too far away: squatting with the arms fully extended is unstable',
      'Timing mismatch: not starting the squat as the ball comes down breaks the rhythm',
    ],
    scaling: [
      {
        level: 'Beginner',
        description: 'Lighter medicine ball or lower target — use a 6–8 kg ball or lower the target height to master the movement pattern first.',
      },
      {
        level: 'Intermediate',
        description: 'Separate squat and throw practice — first practice a perfect air squat, then practice medicine-ball throws separately, then combine them.',
      },
      {
        level: 'Advanced',
        description: 'Above-RX ball weight or target — use a heavier ball or a higher target to further develop power and endurance.',
      },
    ],
    howToSteps: [
      { name: 'Set your position', text: 'Hold the ball at the chest and stand about 50 cm from the wall with the feet shoulder-width apart.' },
      { name: 'Squat down', text: 'Holding the ball, squat to full depth until the hip crease is below the knees.' },
      { name: 'Explosive drive', text: 'Drive through the heels, stand up explosively, and throw the ball upward.' },
      { name: 'Hit the target', text: 'Make sure the ball touches the target height (3 m or 2.7 m).' },
      { name: 'Catch and repeat', text: 'Catch the ball coming down and flow straight into the next squat to keep your rhythm.' },
    ],
  },

  'double-under': {
    equipment: ['Jump rope'],
    primaryMuscles: ['Calves', 'Forearms', 'Core', 'Cardiorespiratory system'],
    overview: `The double-under is a skill in which the rope passes under the feet twice during a single jump. Unlike a plain jump, it is a timing skill that requires precisely syncing the rope's rotation speed with the body's rhythm, and a metabolic conditioning exercise that tests cardiorespiratory capacity to the limit.

The key to the double-under is not the jump but the speed of the rope. Increasing wrist rotation speed so the rope can pass twice quickly takes priority over jumping higher. Many beginners make the mistake of jumping high and end up making the double-under harder.

A correct double-under posture keeps the body in a straight line. Kicking the feet back ("donkey kick"), bending the knees excessively, and bending forward at the waist are all faulty patterns. These compensations are also why double-unders don't link together consecutively.

Hold the rope handles comfortably, but loosely enough that the wrists can move freely. Keeping the elbows fixed at the sides and rotating only the wrists is the key to efficient energy use.

In CrossFit, double-unders appear in many WODs, including "Annie" (double-unders and sit-ups, 50-40-30-20-10). Advanced athletes can perform 100 or more per minute, at which point heart rate reaches over 90% of maximum.`,
    technicalStandards: [
      'The rope passes under the feet twice per jump',
      'Keep the body in a straight line (no kicking the feet or over-bending the knees)',
      'Keep the elbows fixed at the sides and turn the rope with the wrists only',
      'Land on the ball of the foot to minimize rebound',
      'Minimize jump height and maximize rope rotation speed',
      'Sync rhythm and breathing',
    ],
    commonFaults: [
      'Donkey kick: kicking both feet back as you jump, leaning the body forward',
      'Overusing the arms: turning the rope with the whole arm causes fast fatigue and breaks the rhythm',
      'Jumping too high: mistaking it for a jump problem rather than a rope-speed problem, wasting energy',
      'Landing on the heels: landing on the heels spikes calf fatigue and breaks rhythm',
    ],
    scaling: [
      {
        level: 'Beginner',
        description: 'Single-unders × 3 — substitute 3 single-unders for each double-under. Or practice a single-double pattern, alternating one single-under with each double-under attempt.',
      },
      {
        level: 'Intermediate',
        description: 'Power jumps + separate wrist drills — first learn the jump rhythm without a rope, and separately practice drills that spin the rope fast with the wrists only.',
      },
      {
        level: 'Advanced',
        description: 'Triple-under — an advanced skill where the rope passes three times per jump, requiring far more focus and timing than the double-under.',
      },
    ],
    howToSteps: [
      { name: 'Grip and posture', text: 'Hold the handles comfortably, keep the elbows at the sides, and stand tall.' },
      { name: 'Start with single-unders', text: 'Find your rhythm first with regular jump rope.' },
      { name: 'Accelerate the wrists', text: 'At the peak of the jump, rotate the wrists quickly twice so the rope passes twice.' },
      { name: 'Land and rebound', text: 'Land softly on the balls of the feet and link immediately into the next jump.' },
      { name: 'Continuous rhythm', text: 'Match breathing to rhythm and keep the double-unders going.' },
    ],
  },

  'burpee': {
    equipment: ['Bodyweight'],
    primaryMuscles: ['Full body (cardiorespiratory system, core, shoulders, quadriceps, glutes)'],
    overview: `The burpee is the most universally used full-body metabolic conditioning exercise in CrossFit. It is a sequence in which you go from standing to the floor, lie flat, then get back up and jump, and with no equipment it raises heart rate quickly and recruits muscle throughout the body with great efficiency.

The burpee originated in the 1930s with the American physiologist Royal H. Burpee, who developed it as a fitness test; it was adopted in military training and then spread to fitness communities worldwide. CrossFit builds on it by adding the chest-to-ground standard and the jump-and-clap standard, applying stricter criteria.

By the CrossFit standard, one rep is the chest and thighs touching the floor at the same time, then standing back up and jumping with the feet leaving the ground, clapping overhead. This standard ensures a full range of motion.

Burpees can be modified in many ways to adjust difficulty and muscle recruitment: the box burpee (jumping onto a box), the bar-facing burpee (burpee beside a bar and jumping to touch it), the burpee pull-up, and more.

High-intensity burpee training is very effective for improving cardiorespiratory fitness, burning fat, and building muscular endurance, and at a pace of 15–20 per minute, heart rate reaches its maximum.`,
    technicalStandards: [
      'The chest and thighs must touch the floor at the same time (chest-to-ground)',
      'Pass through a plank and jump both feet to the hands at the same time',
      'Jump with the feet leaving the ground from a fully standing position',
      'Clap overhead, or at least bring both hands overhead',
      'Full-body extension at each phase',
      'Perform rhythmically and continuously to maximize energy efficiency',
    ],
    commonFaults: [
      'Touching with only the chest or only the thighs: only one of the two touches, falling short of the standard',
      'Stepping one foot at a time: stepping out instead of jumping both feet at once lowers intensity',
      'Standing without jumping: skipping the jump where the feet leave the ground reduces metabolic demand',
      'Spinal collapse from fatigue: when tired, the back bends and the body drops to the floor',
    ],
    scaling: [
      {
        level: 'Beginner',
        description: 'Incline burpee — place the hands on a box or bench in a plank position and step out. Less impact means less strain on the joints.',
      },
      {
        level: 'Intermediate',
        description: 'No-push-up burpee — lie with the chest on the floor without doing a push-up. The intensity is lower, but the movement pattern stays the same.',
      },
      {
        level: 'Advanced',
        description: 'Burpee box jump-over or burpee pull-up — after the burpee, jump over a box or grab a pull-up bar and add a pull-up, for a higher intensity.',
      },
    ],
    howToSteps: [
      { name: 'Starting position', text: 'From a standing position, squat down toward the floor and place the hands on the ground.' },
      { name: 'Transition to plank', text: 'Jump or step both feet back at the same time into a plank position.' },
      { name: 'Touch the floor', text: 'Lower the body so the chest and thighs touch the floor at the same time.' },
      { name: 'Stand up', text: 'Push the floor away with both hands, jump both feet to the hands at the same time, and stand up.' },
      { name: 'Finishing jump', text: 'Jump with the feet leaving the ground and clap overhead.' },
    ],
  },

  'kettlebell-swing': {
    equipment: ['Kettlebell'],
    primaryMuscles: ['Hamstrings', 'Glutes', 'Lower back', 'Core', 'Forearms'],
    overview: `The kettlebell swing is an explosive expression of the hip hinge, rooted in traditional Russian training, and a core metabolic conditioning exercise in CrossFit. It trains the whole body around the explosive extension of the glutes and hamstrings, and is especially effective for developing the "posterior chain."

There are two main forms of the kettlebell swing. In the Russian swing, the kettlebell rises only to shoulder height; in the American swing, it rises fully overhead. CrossFit mainly uses the American swing, and the RX standard is for the kettlebell to rise fully overhead with the arms extended.

The key to the swing is "pushing with the hips, not lifting with the arms." Pull the kettlebell back between the legs and create a hip hinge (the loading phase), then extend the hips and knees explosively (the drive phase) so that force swings the kettlebell forward. Without this drive, you end up with a "shame swing," lifting the kettlebell with only the arms and shoulders.

The kettlebell swing can create high shear stress on the spine, so keeping a neutral spine is very important. Performing it with a rounded back, in particular, raises the risk of lower-back injury. Choosing an appropriate weight and learning a correct hinge pattern must come first.`,
    technicalStandards: [
      'Hip hinge: push the hips back and swing the kettlebell back between the legs',
      'Propel the kettlebell with explosive hip and knee extension',
      'The arms only guide the kettlebell (they do not lift it)',
      'American swing: the kettlebell rises overhead to full arm extension',
      'Maintain a neutral spine throughout (no rounding during the hinge)',
      'Bend the knees only slightly as the kettlebell passes between the legs (it is not a squat)',
    ],
    commonFaults: [
      'Squat swing: using a squat pattern instead of a hip hinge sharply increases leg fatigue',
      'Shame swing: lifting with the arms alone, with no hip drive',
      'Rounded back: spinal flexion during the hinge phase causes lower-back injury',
      'Excessive lumbar extension: leaning too far back at the top of the swing compresses the lumbar spine',
    ],
    scaling: [
      {
        level: 'Beginner',
        description: 'Romanian deadlift (RDL) drill — master the hip hinge pattern before the kettlebell swing, building accurate hinge awareness with a light weight.',
      },
      {
        level: 'Intermediate',
        description: 'Russian swing — stabilize the hip-drive pattern and neutral spine first with the Russian swing, which only rises to shoulder height.',
      },
      {
        level: 'Advanced',
        description: 'Single-leg kettlebell swing or kettlebell snatch — build stability with a one-legged swing, or progress to the snatch pattern, flipping the kettlebell overhead.',
      },
    ],
    howToSteps: [
      { name: 'Setup', text: 'Stand shoulder-width apart in front of the kettlebell and hinge at the hips to grab it.' },
      { name: 'Hike back', text: 'Hike the kettlebell back high between the legs to create backward momentum.' },
      { name: 'Hip drive', text: 'Thrust the hips forward explosively to propel the kettlebell.' },
      { name: 'Top of the swing', text: 'The kettlebell rises overhead (American) or to shoulder height (Russian).' },
      { name: 'Return to the hinge', text: 'As the kettlebell falls back between the legs, receive it with a hip hinge to keep the rhythm going.' },
    ],
  },

  'rowing': {
    equipment: ['Rowing ergometer (Concept2)'],
    primaryMuscles: ['Lower back', 'Hamstrings', 'Glutes', 'Upper back', 'Biceps', 'Core'],
    overview: `Rowing, on a Concept2 rowing ergometer, is a full-body metabolic conditioning exercise and one of the most widely used pieces of cardio equipment in CrossFit. The movement pattern matches real on-water rowing, recruiting an impressive 86% of the muscles in the body.

The rowing stroke has four phases: Catch → Drive → Finish → Recovery. Understanding this cycle is the starting point for efficient rowing.

At the catch, bend the knees, lean the torso slightly forward, and with the arms fully extended prepare to push off the footplate. The drive goes in order: legs first (60%), then a slight lean of the torso back (20%), and finally the arms pull (20%). If this order is wrong, leg power cannot be transferred to the arms and back.

At the finish, the legs are fully extended, the handle sits at the lower ribs/upper abdomen, and the torso leans slightly back. The recovery returns in reverse — arms → torso → legs — preparing for the next stroke.

In CrossFit, rowing is measured in calories (Cal) or meters (m). The 500 m row time is an important benchmark of a CrossFit athlete's aerobic capacity, and the elite standard for men is under 1:25.`,
    technicalStandards: [
      'Drive order: legs → torso lean → arms (follow this order strictly)',
      'Catch: shins vertical, arms fully extended, torso leaning slightly forward',
      'Finish: legs fully extended, handle pulled to the lower abdomen, torso leaning slightly back',
      'Stroke ratio: drive (power) to recovery (return) timing of 1:2',
      'Foot straps secured over the middle of the foot',
      'Control the slide so the seat does not rush past the heels',
    ],
    commonFaults: [
      'Arms and back first: pulling with the arms before the legs have extended wastes leg power',
      'Rounded back: spinal flexion during the catch and drive strains the lower back',
      'Scooping: the knees rise before the arms during recovery, disrupting the catch timing',
      'Excessive layback: leaning too far back at the finish causes loss of balance and lumbar compression',
    ],
    scaling: [
      {
        level: 'Beginner',
        description: 'Legs-only drive drill — fix the arms and push with only the legs to learn the drive order and footplate power first.',
      },
      {
        level: 'Intermediate',
        description: 'Damper setting 3–5 — a higher damper level is not necessarily better. Perfect your technique at a 3–5 setting before raising the intensity.',
      },
      {
        level: 'Advanced',
        description: 'Interval rowing — develop maximum power output and aerobic capacity together with intervals such as 500 m × 5–8 sets or 250 m × 10 sets.',
      },
    ],
    howToSteps: [
      { name: 'Catch position', text: 'Bend the knees, lean the torso toward about 11 o\'clock, and extend the arms fully into the catch position.' },
      { name: 'Leg drive', text: 'Push hard on the footplate and extend the legs explosively first.' },
      { name: 'Torso lean', text: 'Once the legs are nearly straight, lean the torso back slightly to transfer power.' },
      { name: 'Arm pull', text: 'Finally, pull the elbows back and touch the handle to the lower abdomen.' },
      { name: 'Recovery', text: 'Return in the order arms → torso → legs back to the catch position.' },
    ],
  },

  'clean': {
    equipment: ['Barbell'],
    primaryMuscles: ['Hamstrings', 'Glutes', 'Upper back', 'Trapezius', 'Core', 'Full body'],
    overview: `The clean is a core Olympic weightlifting movement: an explosive full-body power exercise that lifts the barbell from the floor to the shoulders (the rack position) in one motion. In CrossFit it is programmed in many variations, including the power clean, hang clean, and squat clean.

A successful clean depends on a perfect pull. In the first pull, similar to a deadlift, the bar passes the knees, and in the second pull comes an explosive hip extension together with a shrug that lifts the shoulders toward the ears. This moment is the key phase that gives the bar its greatest acceleration.

At the instant the bar reaches its peak height, the elbows rotate quickly forward in the "flip" or "under-pull," and at the same time you drop under the bar into the rack position. In the power clean this drop is about a quarter squat; in the squat clean, you descend to a full-depth squat.

In the rack position, the elbows must be as high as possible, and the bar should rest on the front of the palms (a fingertip grip) rather than on the fingers. Maintaining this grip requires wrist and forearm flexibility.

The clean and jerk is an Olympic weightlifting event in which you jerk the bar overhead after the clean. In CrossFit, the clean alone or the full clean and jerk is used in WODs.`,
    technicalStandards: [
      'First pull: the same pattern as a deadlift, bar up to above the knees',
      'Second pull: explosive hip extension + shrug to give the bar maximum acceleration',
      'Drop and flip: rotate the elbows quickly forward to form the rack position',
      'Rack position: elbows high, bar resting on the front deltoids',
      'Power clean: catch in a quarter squat / squat clean: catch in a full-depth squat',
      'Standing: finish by fully standing up out of the squat',
    ],
    commonFaults: [
      'Early arm pull: pulling with the arms before the second pull destroys the bar path',
      'Bar drift: the bar drifts away from the body and delivers only a fraction of its efficiency',
      'No shrug: the traps do not fire at the top of the second pull, leaving the bar too low',
      'Incomplete rack position: elbows low so the bar sits on the wrists, risking wrist injury',
    ],
    scaling: [
      {
        level: 'Beginner',
        description: 'Hang power clean — start with the bar above the thighs, skip the first pull, and focus on the second pull and rack position. Master both the deadlift and the clean before moving to the full clean.',
      },
      {
        level: 'Intermediate',
        description: 'Power clean — catch in a quarter squat without a full squat. Focus on developing technique rather than going heavier.',
      },
      {
        level: 'Advanced',
        description: 'Squat clean or clean and jerk — progress to the complete Olympic lift, combining a full-depth squat clean with the jerk.',
      },
    ],
    howToSteps: [
      { name: 'Setup', text: 'Stand in front of the barbell in the same setup as the deadlift and grip the bar.' },
      { name: 'First pull', text: 'Pull the bar up to above the knees in a deadlift pattern.' },
      { name: 'Second pull', text: 'Rise onto the heels, extend the hips explosively, and shrug the shoulders toward the ears.' },
      { name: 'Drop and catch', text: 'Rotate the elbows quickly forward and drop under the bar into the rack position.' },
      { name: 'Complete the squat', text: 'Stand fully up out of the squat and extend the hips to finish.' },
    ],
  },
}
