import type { MovementEn } from './types'

export const MOVEMENTS_EN_PART1: Record<string, MovementEn> = {
  'pull-up': {
    equipment: ['Pull-up bar'],
    primaryMuscles: ['Latissimus dorsi', 'Biceps', 'Core'],
    overview: `The pull-up is one of the most fundamental and essential upper-body pulling exercises in CrossFit. It strengthens the back, arms, and core all at once, and is widely regarded as the most efficient bodyweight movement for building practical, functional strength.

The starting position is a dead hang: grip the bar with an overhand grip (palms facing away) at shoulder width or slightly wider, with the arms fully extended. This start matters a great deal. Before you pull, set your shoulder blades down and back (scapular setting) so your shoulders don't shrug up toward your ears. Skipping this preparation significantly raises the risk of shoulder injury.

To begin the pull, think of the back muscles (lats and rhomboids) contracting first and drawing your body upward. Pull until your chin clears the bar, and pausing briefly at the top maximizes muscle contraction. On the way down, resist gravity and lower slowly under control — this eccentric contraction builds strength and muscle faster.

CrossFit also uses the kipping pull-up and the butterfly pull-up. Kipping uses swing momentum to perform more reps quickly, which suits high-intensity interval training (HIIT) and metcon WODs where explosive output matters. To kip safely, however, it is recommended that you first build at least 10 strict pull-ups.

Consistent pull-up training builds functional strength, and also improves posture, shoulder stability, and upper-body muscle development. It is a key exercise for strengthening the back muscles that tend to weaken in people who sit for long hours.`,
    technicalStandards: [
      'Start from a dead hang with arms fully extended',
      'Grip the bar overhand, at shoulder width or wider',
      'Set the shoulder blades down (scapular setting) to protect the shoulders',
      'Pull until the chin is clearly above the bar',
      'Keep the torso stable with no kicking or swinging (strict standard)',
      'Lower slowly and under control with an eccentric contraction',
    ],
    commonFaults: [
      'Shoulder shrug: shoulders rise toward the ears at the start, causing shoulder impingement',
      'Half rep: the elbows do not fully extend or the chin does not clear the bar',
      'Excessive forward swing: the core is not engaged, so the body sways back and forth and injury risk rises',
      'Dropping too fast: coming down explosively sends shock into the shoulder joint',
    ],
    scaling: [
      {
        level: 'Beginner',
        description: 'Banded pull-up — loop a resistance band over the bar and place a foot or knee in it to reduce the load. Or substitute ring rows to activate the back muscles first.',
      },
      {
        level: 'Intermediate',
        description: 'Negative pull-up — jump to the top of the bar, then lower yourself slowly over 5–8 seconds, training only the eccentric phase.',
      },
      {
        level: 'Advanced',
        description: 'Weighted pull-up — attach extra load with a dip belt or backpack to maximize strength and muscle growth.',
      },
    ],
    howToSteps: [
      { name: 'Grip the bar', text: 'Grab the bar overhand at shoulder width or wider and hang with arms fully extended.' },
      { name: 'Set the shoulders', text: 'Pull the shoulder blades down and open the chest to stabilize the shoulders.' },
      { name: 'Start the pull', text: 'Engage the lats first and drive the elbows toward your ribs.' },
      { name: 'Reach the top', text: 'Pull until the chin clears the bar and pause briefly.' },
      { name: 'Controlled descent', text: 'Lower slowly, keeping tension in the eccentric phase, back to the start position.' },
    ],
  },

  'push-up': {
    equipment: ['Bodyweight'],
    primaryMuscles: ['Pectorals', 'Triceps', 'Front deltoids', 'Core'],
    overview: `The push-up is the most basic upper-body pushing exercise, and it can be done anywhere with no equipment. It looks simple, but performed correctly it is a compound movement that recruits muscle throughout the body — not just the chest, shoulders, and arms, but also the core and lower body.

The starting position is a plank, with the wrists directly under or slightly outside the shoulders. Spreading the fingers slightly and pointing the index fingers forward reduces strain on the wrists. The body should form a straight line from head to heels, and you must brace the core and glutes so the hips neither pike up nor sag.

The CrossFit standard is "chest-to-ground": lower until the chest fully touches the floor. Keeping the elbows at 45–60 degrees to the torso is safest for the shoulder joint. If the elbows flare too far out, excessive load concentrates on the front of the shoulder.

On the way up, press the floor away explosively with your palms. This pushing strength should balance the pulling strength you build in pull-ups so that functional upper-body strength develops in harmony.

CrossFit also programs many variations, including diamond push-ups, wide push-ups, ring push-ups, and the hand-release push-up. In the hand-release push-up you briefly lift both hands off the floor at the bottom, which is used to verify the chest actually touches down.`,
    technicalStandards: [
      'Plank position with wrists under the shoulders and fingers slightly spread',
      'Straight line from head to heels — no piking or sagging hips',
      'Lower until the chest fully touches the floor',
      'Keep elbows at 45–60 degrees relative to the torso',
      'Brace the core and glutes to stabilize the torso',
      'Press up until the arms are fully extended',
    ],
    commonFaults: [
      'Worm position: the hips rise first and the chest follows later — a segmented movement',
      'Elbow flare: elbows flare out to 90 degrees, overloading the front of the shoulder',
      'Partial range of motion: the chest does not touch the floor, reducing muscle activation',
      'Head drop: the chin dives toward the floor first, putting excess tension on the neck',
    ],
    scaling: [
      {
        level: 'Beginner',
        description: 'Knee push-up — perform with knees on the floor to reduce bodyweight load. This builds base strength before the full push-up.',
      },
      {
        level: 'Intermediate',
        description: 'Incline push-up — place the hands on a box or bench to raise the angle and reduce the load. Gradually lower the incline until you progress to floor push-ups.',
      },
      {
        level: 'Advanced',
        description: 'Decline push-up or added weight — raise the feet on a box or put plates in a backpack to increase intensity.',
      },
    ],
    howToSteps: [
      { name: 'Plank setup', text: 'Place the hands shoulder-width apart, bring the feet together, and align the body in a straight line.' },
      { name: 'Brace the core', text: 'Squeeze the abs and glutes to stabilize the torso.' },
      { name: 'Lower down', text: 'Bend the elbows at about 45 degrees and lower until the chest touches the floor.' },
      { name: 'Touch the floor', text: 'Pause briefly at the moment the chest fully touches the ground.' },
      { name: 'Press up', text: 'Push the floor away with the palms until the arms are fully extended.' },
    ],
  },

  'handstand-push-up': {
    equipment: ['Wall'],
    primaryMuscles: ['Deltoids', 'Triceps', 'Upper trapezius', 'Core'],
    overview: `The handstand push-up (HSPU) is one of the most demanding upper-body movements in CrossFit — a pressing movement performed while upside down. It requires a combination of shoulder strength, balance, core stability, and body awareness.

In the wall-facing HSPU, you face the wall with the hands about 15–20 cm (6–8 in) away from it. The feet rest on the wall and the body is held vertical in the start position. Placing the hands so they form a triangle with the head helps distribute load efficiently across the shoulders and triceps.

The standard range of motion is lowering until the head touches the floor, then driving explosively back up until the arms are fully extended — that is one rep. On the way down the elbows should point forward or slightly outward; if they flare out too far, a serious shoulder injury can result.

In competition settings such as the CrossFit Open, the standards are stricter, and an AbMat is sometimes placed under the head, which must touch it. This rule ensures a consistent range of motion.

The HSPU is a core skill in disciplines like military training, gymnastics, and parkour, and builds functional overhead strength. Without proper preparation it can injure the wrists, shoulders, and neck, so progressive scaling is very important.`,
    technicalStandards: [
      'Start in a handstand with the arms fully extended',
      'Hands about 15–20 cm from the wall, in a triangle position with the head',
      'Lower until the head (or AbMat) touches the floor',
      'Keep the elbows at 30–45 degrees (no excessive flaring)',
      'Brace the abs firmly to prevent over-arching the lower back',
      'Press until the arms are locked out at the top',
    ],
    commonFaults: [
      'Excessive lumbar extension: the lower back arches too much and compresses the spine',
      'Excessive elbow flare: elbows splay out like chicken wings, risking shoulder injury',
      'Incomplete range of motion: the head does not touch the floor or the arms do not fully extend',
      'Landing on the neck: when the arms fatigue, the neck touches first, risking cervical injury',
    ],
    scaling: [
      {
        level: 'Beginner',
        description: 'Pike push-up — in a face-down position, lift the hips high to form an inverted V and lower the head toward the floor. This trains the same muscle groups as the HSPU using a portion of bodyweight.',
      },
      {
        level: 'Intermediate',
        description: 'Box HSPU — place the feet on a box so the hips are bent at 90 degrees. The higher the box, the closer it gets to a full HSPU.',
      },
      {
        level: 'Advanced',
        description: 'Strict HSPU — perform it as a free-standing handstand without the wall, or strictly (no kipping) for even higher intensity.',
      },
    ],
    howToSteps: [
      { name: 'Handstand kick-up', text: 'Place the hands on the floor about 15–20 cm from the wall and kick the feet up into a handstand.' },
      { name: 'Align the body', text: 'Brace the abs and align the body vertically.' },
      { name: 'Lower down', text: 'Bend the elbows and lower until the head touches the floor (or AbMat).' },
      { name: 'Touch the head', text: 'Pause briefly as the head touches the floor and prepare to drive up explosively.' },
      { name: 'Press up', text: 'Push the floor away hard with the palms until the arms are fully extended.' },
    ],
  },

  'muscle-up': {
    equipment: ['Pull-up bar', 'Rings'],
    primaryMuscles: ['Latissimus dorsi', 'Pectorals', 'Triceps', 'Biceps', 'Core'],
    overview: `The muscle-up combines a pull and a push into one continuous movement, and is an iconic advanced exercise in CrossFit. Performing a pull-up and a dip back to back demands functional strength and coordination from the entire upper body.

There are two forms: the ring muscle-up and the bar muscle-up. The instability of the rings recruits more stabilizing muscles in the ring muscle-up, while the bar muscle-up is performed on a fixed structure, so the path is relatively set.

The heart of the movement is the transition. The hardest moment is at the top of the pull, when you must rotate over the rings or bar into the starting position of a dip. As the elbows pass above the bar or rings, the wrists rotate and you transition into the dip position.

CrossFit often uses the kipping muscle-up, where swing momentum helps with the transition phase. Still, without a base of at least 10 strict pull-ups and 10 dips, this can cause serious injury to the shoulders and elbows.

Achieving a muscle-up is recognized in the CrossFit community as a milestone — "getting your first ring muscle-up" — and it opens a path to more complex ring movements such as the ring HSPU and ring L-sit.`,
    technicalStandards: [
      'Grip the rings/bar with a false grip or a normal grip',
      'At the top of the pull, the elbows move above the rings/bar',
      'During the transition the wrists rotate naturally into the dip position',
      'Complete the dip: press up until the arms are fully extended',
      'Keep the core braced throughout every phase',
      'On ring muscle-ups, keep the rings close to the torso (no excessive outward flare)',
    ],
    commonFaults: [
      'Failed transition: the elbows cannot get above the rings/bar and the movement stalls',
      'Chicken wing dip: one arm locks out before the other, creating an asymmetrical movement',
      'Insufficient pull height: not pulling high enough before the transition makes it impossible',
      'Excessive kipping: relying on momentum without base strength damages the shoulders',
    ],
    scaling: [
      {
        level: 'Beginner',
        description: 'Banded ring muscle-up — loop a resistance band on the rings to help lift the hips through the transition. Or practice box muscle-ups with the feet on the floor.',
      },
      {
        level: 'Intermediate',
        description: 'Chest-to-bar pull-up + separate ring dip training — strengthen the two movements individually, then practice transition drills.',
      },
      {
        level: 'Advanced',
        description: 'Strict muscle-up — perform it with no swing, using pure strength, to maximize both ring stability and strength.',
      },
    ],
    howToSteps: [
      { name: 'Grip setup', text: 'Grab the rings or bar at shoulder width and start from a dead hang.' },
      { name: 'Explosive pull', text: 'Contract the lats hard and pull the chest quickly above the rings/bar.' },
      { name: 'Transition', text: 'As the elbows pass over the rings/bar, rotate the wrists and move into the dip position.' },
      { name: 'Dip press', text: 'From the dip start position, press up until the arms are fully extended.' },
      { name: 'Finish position', text: 'The arms are fully extended and the body is supported stably above the rings/bar.' },
    ],
  },

  'thruster': {
    equipment: ['Barbell', 'Dumbbell', 'Kettlebell'],
    primaryMuscles: ['Quadriceps', 'Glutes', 'Deltoids', 'Triceps', 'Core'],
    overview: `The thruster combines a front squat and an overhead press into one continuous movement, and is a signature compound exercise of CrossFit. It recruits large muscle groups across the whole body at once, burning the most calories in the least time while building explosive functional strength.

Best known from the "Fran" WOD (21-15-9 thrusters and pull-ups), it is one of CrossFit's legendary benchmark movements. The RX weight is 43 kg (95 lb) for men and 29 kg (65 lb) for women, and many CrossFit athletes use their thruster performance as a personal benchmark.

The start position is the barbell in the front rack on the shoulders, and you perform a front squat. The key is the explosive drive out of the bottom of the squat: the extension force from the legs creates momentum that drives the bar upward, and you use that momentum to finish the overhead press. For efficiency there should be no seam between the squat and the press; if the squat drive is weak, you have to press with the shoulders and arms alone and tire much faster.

Because the thruster raises heart rate very quickly, it is also an excellent metabolic conditioning exercise. Performing continuous heavy barbell thrusters challenges aerobic capacity and muscular endurance to the limit at the same time.`,
    technicalStandards: [
      'Start in the rack position with the bar on the collarbone',
      'Squat bottom: full depth with the hip crease below the knee',
      'The squat drive and the press are one continuous movement',
      'Overhead: arms fully extended with the bar in line behind the ears',
      'Knees track over the toes (no knee valgus)',
      'Brace the core to keep a neutral spine',
    ],
    commonFaults: [
      'Separated dip-and-drive: pausing after the squat before pressing wastes energy',
      'Knee caving: the knees collapse inward during the squat',
      'Incomplete overhead: arms not fully extended or the bar sits in front',
      'Heels lifting: the heels leave the floor and the center of mass shifts forward',
    ],
    scaling: [
      {
        level: 'Beginner',
        description: 'PVC pipe or empty barbell — master the movement pattern first. Learn the correct rack position, a full-depth squat, and a continuous drive.',
      },
      {
        level: 'Intermediate',
        description: 'Dumbbell thruster — using dumbbells trains each arm independently, which is effective for correcting left-right imbalances.',
      },
      {
        level: 'Advanced',
        description: 'Thruster above RX weight — go heavier than the standard RX weight, or set a time cap and aim to lower your Fran time.',
      },
    ],
    howToSteps: [
      { name: 'Rack position', text: 'Rest the bar on the collarbone and lift the elbows high and forward into the rack position.' },
      { name: 'Full-depth squat', text: 'Squat until the hip crease drops below the knees.' },
      { name: 'Drive', text: 'From the bottom of the squat, drive explosively through the floor and stand up.' },
      { name: 'Overhead press', text: 'Use the momentum from the squat drive to press the bar overhead.' },
      { name: 'Finish position', text: 'Finish with the arms fully extended and the bar overhead, behind the ears.' },
    ],
  },
}
