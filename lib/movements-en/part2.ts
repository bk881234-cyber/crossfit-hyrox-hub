import type { MovementEn } from './types'

export const MOVEMENTS_EN_PART2: Record<string, MovementEn> = {
  'air-squat': {
    equipment: ['Bodyweight'],
    primaryMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
    overview: `The air squat is the foundational movement behind every lower-body exercise in CrossFit. It needs no equipment, but understanding and performing it with correct mechanics effectively builds functional strength throughout the lower body.

A correct air squat starts with foot placement: shoulder-width or slightly wider, with the toes turned out 5–30 degrees. Toe angle varies from person to person because of hip anatomy, so it is important to find the angle at which you can comfortably reach full depth (hip crease below the knee).

On the way down, the knees must track in line with the toes and the heels must not leave the floor. Full depth — hips below knee height — is the CrossFit standard for a squat. This full range of motion is essential for fully activating the glutes and hamstrings and improving hip mobility.

Keep the spine neutral, and be careful to avoid "butt wink" (posterior pelvic tilt) at the bottom of the squat. Butt wink places unnecessary pressure on the lumbar discs.

The air squat is the basis for every loaded squat — back squat, front squat, overhead squat — and is also used as a key rehabilitation exercise to restore functional movement patterns, not only for athletes but for the general population.`,
    technicalStandards: [
      'Feet shoulder-width apart, toes turned out 5–30 degrees',
      'Full depth: hip crease below the knee',
      'Knees track over the toes (no knee valgus)',
      'Heels stay in contact with the floor at all times',
      'Maintain a neutral spine (no excessive arching or rounding)',
      'Extend the arms forward for balance (optional)',
    ],
    commonFaults: [
      'Heels lifting: limited Achilles flexibility shifts the center of mass forward',
      'Knee valgus: the knees cave inward, stressing the kneecap and ligaments',
      'Butt wink: the pelvis tucks under at the bottom, compressing the lumbar discs',
      'Excessive forward lean: the torso leans too far forward, overloading the knees',
    ],
    scaling: [
      {
        level: 'Beginner',
        description: 'Box squat — sit back to a box or chair and stand up, learning a safe depth and a neutral spine.',
      },
      {
        level: 'Intermediate',
        description: 'Heel wedge — place a wedge or plate under the heels to compensate for Achilles limitations while practicing full depth.',
      },
      {
        level: 'Advanced',
        description: 'Overhead squat (OHS) prep — building on a perfect air squat, squat with the arms extended overhead to train overhead mobility at the same time.',
      },
    ],
    howToSteps: [
      { name: 'Set the stance', text: 'Stand with the feet shoulder-width apart and the toes turned out about 15–20 degrees.' },
      { name: 'Hip hinge', text: 'Push the hips back as you begin to descend and bend the knees at the same time.' },
      { name: 'Full-depth descent', text: 'Keep lowering until the hip crease is below the knees.' },
      { name: 'Drive up', text: 'Push through the heels and extend the knees and hips together to stand up.' },
      { name: 'Finish', text: 'Stand tall with the hips, knees, and ankles fully extended.' },
    ],
  },

  'deadlift': {
    equipment: ['Barbell'],
    primaryMuscles: ['Hamstrings', 'Glutes', 'Lower back', 'Upper back', 'Core'],
    overview: `The deadlift is lifting a barbell from the floor, a perfect re-creation of the most primal functional movement there is: picking something up. It recruits the whole body and lets you express the most absolute strength in a single movement, which is why it is a core power-development exercise in CrossFit.

The setup is decisive for both success and injury prevention. Place the feet hip-width apart with the bar over the middle of the feet. From there, stand close enough that the shins nearly touch the bar. When you bend down to grip the bar, the shoulder blades should sit directly over the bar to create optimal leverage.

The most important thing before pulling is "lat packing." Contract the lats as if pulling the bar into your body, which prevents the back from rounding. This setup must be complete before the bar leaves the floor.

During the lift, push the floor away to straighten the legs while driving the hips through to complete the movement. Keep the bar as close to the body as possible; the farther the bar drifts from the body, the more the force moment on the lower back rises exponentially.

In CrossFit it is used in many ways, from 1RM max-weight tests to light-weight, high-rep metcons. Variations such as the Romanian deadlift (RDL) and stiff-leg deadlift also allow hamstring-focused work.`,
    technicalStandards: [
      'Feet hip-width apart, bar over the middle of the foot',
      'Shoulder blades directly over the bar, back flat',
      'Engage the lats to keep the bar tight to the body',
      'Keep the bar in contact with the legs throughout the lift',
      'Extend the knees and hips together',
      'Finish standing tall with full hip extension',
    ],
    commonFaults: [
      'Rounded back: pulling without engaging the lats compresses the lumbar discs',
      'Bar drift: the bar swings forward, sharply increasing the lower-back moment',
      'Hips shoot up: the legs straighten first and the back does the pulling — a "morning pull"',
      'Over-hyperextension at lockout: leaning back too far at the end compresses the lumbar spine',
    ],
    scaling: [
      {
        level: 'Beginner',
        description: 'Romanian deadlift (RDL) or dumbbell deadlift — learn the hinge pattern with a light weight and develop hamstring awareness first.',
      },
      {
        level: 'Intermediate',
        description: 'Sumo deadlift — a wider stance with the toes turned out is more accessible for people with limited hip mobility.',
      },
      {
        level: 'Advanced',
        description: '3–5RM or 1RM testing — following the principle of progressive overload, pair it with a strength program such as 5/3/1 or the Texas Method.',
      },
    ],
    howToSteps: [
      { name: 'Setup', text: 'Place the feet hip-width apart with the bar over the middle of the feet.' },
      { name: 'Hinge position', text: 'Push the hips back, bend over, and grip the bar with an overhand or mixed grip.' },
      { name: 'Set the back', text: 'Engage the lats and open the chest to lock the spine in neutral.' },
      { name: 'Lift', text: 'Push the floor away and extend the knees and hips together to lift the bar.' },
      { name: 'Finish position', text: 'Stand fully tall, fully extend the hips, and pull the shoulders back to finish.' },
    ],
  },

  'front-squat': {
    equipment: ['Barbell'],
    primaryMuscles: ['Quadriceps', 'Glutes', 'Core', 'Upper back'],
    overview: `The front squat is a squat variation performed with the barbell resting on the front of the shoulders (the collarbone area). Because it demands a more upright torso than the back squat, quadriceps activation is higher, and strong stabilization from the upper body and core is essential.

Success in the front squat depends on the rack position. The bar must rest across the collarbone and front deltoids, and the elbows must be lifted as high as possible so the bar does not roll forward. If the elbows drop, the bar tips forward and you end up bending the wrists excessively to hold it, which can lead to wrist injuries.

Maintaining this rack position requires enough thoracic spine mobility. If the thoracic spine is stiff, lifting the elbows high is difficult in itself. That is why the front squat is not just a leg exercise but also a test of whole-body mobility.

During the movement, the torso should stay much more vertical than in a back squat. This vertical torso reduces shear force on the spine and distributes load more evenly across the knee structures.

In CrossFit, the front squat is an essential skill as a precursor to the clean, thruster, and overhead squat, and is a key component of the Olympic lifting pathway.`,
    technicalStandards: [
      'Bar rests on the collarbone and front deltoids, elbows as high as possible',
      'Feet shoulder-width apart, toes turned out 15–20 degrees',
      'Full-depth squat with the hip crease below the knee',
      'Keep the torso close to vertical (more upright than a back squat)',
      'Knees track over the toes',
      'Key tip: keeping the elbows high is everything',
    ],
    commonFaults: [
      'Dropping the elbows: the bar tips forward, losing balance and over-straining the wrists',
      'Forward lean: thoracic stiffness tilts the torso forward and overloads the lower back',
      'Heels lifting: limited ankle mobility shifts the center of mass forward',
      'Knee valgus: the knees collapse inward under load',
    ],
    scaling: [
      {
        level: 'Beginner',
        description: 'Goblet squat — holding a kettlebell or dumbbell at the chest requires the same upper-body posture and core stabilization as the front squat.',
      },
      {
        level: 'Intermediate',
        description: 'Cross-arm grip front squat — crossing the arms to hold the bar lets you practice the rack position without wrist flexibility.',
      },
      {
        level: 'Advanced',
        description: 'Overhead squat progression — once the front squat is solid, progress to the overhead squat, which demands greater mobility and stability.',
      },
    ],
    howToSteps: [
      { name: 'Rack position', text: 'Rest the bar on the collarbone and lift the elbows above shoulder height into the rack position.' },
      { name: 'Stance', text: 'Place the feet shoulder-width apart with the toes turned out 15–20 degrees.' },
      { name: 'Descent', text: 'Sit the hips down, staying close to vertical, until the hip crease is below the knees.' },
      { name: 'Keep the elbows up', text: 'Keep the elbows high throughout the descent so the bar does not roll forward.' },
      { name: 'Drive up', text: 'Push explosively through the heels to stand back up.' },
    ],
  },

  'box-jump': {
    equipment: ['Box'],
    primaryMuscles: ['Quadriceps', 'Glutes', 'Calves', 'Core'],
    overview: `The box jump is a core plyometric exercise in CrossFit for developing explosive lower-body power. It may look like a simple jump from the floor onto a box, but it is a highly technical movement that trains the nervous system's maximum recruitment ability and the ability to absorb impact on landing at the same time.

A box jump begins by standing about a shoulder-width distance from the box. Using an active arm swing can increase jump height by up to 20–30%. Perform a countermovement — swinging the arms back while bending the knees — and then swing the arms forward as you jump explosively.

In the air, pull the knees up toward the chest to make room for the feet to land on the box. The most important part of landing is a "soft landing": the whole foot lands on the box and the knees bend to absorb the impact. Landing with straight legs sends a great deal of shock into the joints.

There are two ways to come down: step down and jump down. When doing many reps in a WOD, stepping down is recommended to protect the Achilles tendon. Achilles ruptures from repeated jump-downs under fatigue are among the most common CrossFit injuries, so extra care is needed.

The CrossFit RX box height is 24 inches (about 61 cm) for men and 20 inches (about 51 cm) for women.`,
    technicalStandards: [
      'Take off from both feet at once, using an arm swing to maximize jump power',
      'Pull the knees toward the chest in the air to clear the box',
      'Land on the box with both feet at the same time, whole foot on the box',
      'Bend the knees and hips on landing to absorb impact (soft landing)',
      'Finish with full hip extension on top of the box',
      'Step down when coming off the box (recommended for high rep counts)',
    ],
    commonFaults: [
      'Hard landing: landing with straight knees greatly increases joint impact',
      'Landing on the toes instead of the whole foot: unstable and overloads the Achilles tendon',
      'No hip extension on top: coming straight down after landing misses completing the movement',
      'No arm swing: lower jump height risks hitting the shins on the box edge',
    ],
    scaling: [
      {
        level: 'Beginner',
        description: 'Step-up — stepping onto the box one foot at a time builds leg strength and balance. Start with a 20–30 cm box height.',
      },
      {
        level: 'Intermediate',
        description: 'Lower box jump or plate jump — master landing technique on a box 10–20 cm lower, then raise the height gradually.',
      },
      {
        level: 'Advanced',
        description: 'Depth jump or single-leg box jump — drop from a higher box and rebound into an immediate jump, or perform advanced variations on one leg.',
      },
    ],
    howToSteps: [
      { name: 'Starting position', text: 'Stand a shoulder-width distance from the box with the feet shoulder-width apart.' },
      { name: 'Countermovement', text: 'Swing the arms back and bend the knees to prepare for the jump.' },
      { name: 'Explosive jump', text: 'Swing the arms forward and drive hard through the floor to jump as high as possible.' },
      { name: 'Soft landing', text: 'Land with the whole foot on the box, bending the knees and hips to absorb the impact.' },
      { name: 'Finish and descend', text: 'Fully extend the hips, then step down from the box.' },
    ],
  },
}
