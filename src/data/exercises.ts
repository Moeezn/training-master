import { Exercise } from '../types';

export const EXERCISES: Exercise[] = [
  // CALISTHENICS: Pushups & Incline Regression
  {
    id: 'pushups_standard',
    title: 'Standard Bodyweight Pushup',
    category: 'calisthenics',
    difficulty: 'intermediate',
    targetReps: 10,
    demanding: true,
    contextualWarning: 'Caution: Maintain a neutral cervical spine and do not flare your elbows past 45 degrees to safeguard the anterior shoulder capsule and rotator cuff.',
    safetyReminders: [
      'Keep glutes and core braced; do not allow lower back to sag.',
      'Control your descent (2 seconds down, 1 second press).',
      'If wrist discomfort occurs, use pushup handles, dumbbells, or switch to incline pushups.'
    ],
    easierAlternativeId: 'pushups_incline',
    easierAlternativeName: 'Incline / Wall Pushup',
    warmupRequired: 'Wrist circles (30s) and shoulder dislocates or wall slides (60s).',
    cooldownRecommended: 'Chest doorway stretch (30s per side) and deep breathing.',
    accessibleDescription: 'Start in a high plank position with hands slightly wider than shoulder-width, fingers spread forward. Inhale as you lower your chest until elbows reach 90 degrees. Exhale as you drive through your palms to return to top plank.',
    formCues: [
      { phase: 'Setup', instruction: 'Hands slightly wider than shoulders, fingers pointed forward, toes tucked, glutes squeezed.', breathing: 'Deep belly inhale' },
      { phase: 'Descent', instruction: 'Lower slowly over 2 seconds; keep elbows angled at roughly 45 degrees like an arrow.', breathing: 'Inhale steadily' },
      { phase: 'Ascent', instruction: 'Push floor away firmly until arms reach lockout without hyperextending elbows.', breathing: 'Forceful exhale' }
    ],
    commonMistakes: [
      'Flaring elbows out at 90 degrees (strains rotator cuff)',
      'Allowing hips to drop and hyper-extending the lumbar spine',
      'Dropping the chin forward instead of lowering the chest'
    ],
    hydrationTip: 'Sip 150-200ml of water after every 2-3 sets to keep connective tissues hydrated.',
    iconName: 'Shield'
  },
  {
    id: 'pushups_incline',
    title: 'Incline Wall or Bench Pushup',
    category: 'calisthenics',
    difficulty: 'beginner',
    targetReps: 12,
    demanding: false,
    safetyReminders: [
      'Ensure the wall, counter, or sturdy bench will not slip during pressing.',
      'Engage abdominals throughout the movement.'
    ],
    warmupRequired: 'Arm circles and wrist rotations for 45 seconds.',
    cooldownRecommended: 'Gentle shoulder rolls and overhead tricep stretch.',
    accessibleDescription: 'Stand facing a sturdy wall or elevated bench. Place hands flat against the surface at chest height. Lower chest toward surface with a rigid torso, then press back to starting stance.',
    formCues: [
      { phase: 'Setup', instruction: 'Feet hip-width apart, hands flat on elevated surface at chest height.', breathing: 'Inhale to prepare' },
      { phase: 'Lowering', instruction: 'Control descent smoothly, feeling tension across chest and triceps.', breathing: 'Inhale' },
      { phase: 'Pushing', instruction: 'Drive through palms into starting position, keeping spine neutral.', breathing: 'Exhale' }
    ],
    commonMistakes: [
      'Bending at the waist instead of maintaining plank posture',
      'Placing hands too high above shoulder height'
    ],
    hydrationTip: 'Stay hydrated with ambient temperature water between rounds.',
    iconName: 'Feather'
  },

  // SQUATS & BOX SQUAT REGRESSION
  {
    id: 'air_squats',
    title: 'Functional Bodyweight Squat',
    category: 'calisthenics',
    difficulty: 'beginner',
    targetReps: 15,
    demanding: false,
    safetyReminders: [
      'Keep your knees tracking directly in line with your 2nd and 3rd toes.',
      'Distribute weight evenly across the tripod of your feet (big toe, pinky toe, heel).',
      'Stop at the depth where you can maintain a flat back; do not force "butt wink".'
    ],
    easierAlternativeId: 'box_squat_chair',
    easierAlternativeName: 'Assisted Chair / Box Squat',
    warmupRequired: 'Hip openers (pigeon or 90/90 flow) and ankle mobility dorsiflexion (60s).',
    cooldownRecommended: 'Standing quadriceps and kneeling hip flexor stretch.',
    accessibleDescription: 'Stand with feet shoulder-width apart, toes turned slightly out. Initiate by sending hips back and down as if sitting into an invisible chair. Lower until thighs are parallel to ground or comfortable depth, then push through heels to stand.',
    formCues: [
      { phase: 'Setup', instruction: 'Stand tall, feet shoulder-width, chest proud, gaze straight ahead.', breathing: 'Inhale through nose' },
      { phase: 'Descent', instruction: 'Hips hinge backward first, knees track outward, chest stays upright.', breathing: 'Inhale deep into abdomen' },
      { phase: 'Ascent', instruction: 'Drive through midfoot and heels, squeeze glutes at the top without hyperextending.', breathing: 'Exhale smoothly' }
    ],
    commonMistakes: [
      'Knees collapsing inward (valgus collapse)',
      'Heels lifting off the floor during descent',
      'Rounding the lower spine'
    ],
    hydrationTip: 'Hydrate before leg routines to reduce cramping risks in quads and calves.',
    iconName: 'Activity'
  },
  {
    id: 'box_squat_chair',
    title: 'Assisted Chair / Box Squat',
    category: 'active_recovery',
    difficulty: 'beginner',
    targetReps: 10,
    demanding: false,
    safetyReminders: [
      'Use a sturdy, non-wheeled chair or bench.',
      'Lightly touch the seat; do not collapse your weight downward abruptly.'
    ],
    warmupRequired: 'Ankle circles and seated knee extensions.',
    cooldownRecommended: 'Seated hamstring stretch.',
    accessibleDescription: 'Stand directly in front of a secure chair. Hinge hips back until your glutes lightly contact the seat cushion, then immediately drive upward to stand tall.',
    formCues: [
      { phase: 'Descent', instruction: 'Hips back, knees out, lower with 3-second control until touching seat.', breathing: 'Inhale' },
      { phase: 'Ascent', instruction: 'Push down through whole foot and stand tall.', breathing: 'Exhale' }
    ],
    commonMistakes: ['Rocking backward onto chair and losing core tension'],
    hydrationTip: 'Small sips of water during brief rests.',
    iconName: 'Smile'
  },

  // MARTIAL ARTS: Boxing Jab-Cross Striking Combo
  {
    id: 'boxing_jab_cross',
    title: 'Boxing Jab-Cross Combination',
    category: 'martial_arts',
    difficulty: 'intermediate',
    targetReps: 20,
    demanding: true,
    contextualWarning: 'High impact safety note: NEVER hyper-extend your elbow joint on punch impact. Always snap the strike back to guard before full joint lockout. Keep non-punching hand glued to jawline.',
    safetyReminders: [
      'Pivot your rear foot and rotate your hip on the cross to generate torque safely without twisting your knee.',
      'Keep chin tucked down toward chest and shoulders relaxed.',
      'Breathe sharply on each punch to brace core.'
    ],
    easierAlternativeId: 'shadow_slow_strikes',
    easierAlternativeName: 'Slow-Motion Guard & Shadow Mechanics',
    warmupRequired: 'Jump rope simulation (60s), torso rotations, and neck mobility (30s).',
    cooldownRecommended: 'Shoulder posterior stretch and deep diaphragmatic breathing (90s).',
    accessibleDescription: 'Assume an athletic staggered boxing stance. Lead hand extends straight out for the jab, rotating knuckles flat, then instantly snaps back. Rear hand fires cross while rear hip and ball of rear foot pivot forward.',
    formCues: [
      { phase: 'Stance', instruction: 'Staggered stance, knees slightly bent, hands at cheekbones, elbows guarding ribs.', breathing: 'Rhythmic breath' },
      { phase: 'Jab (Lead)', instruction: 'Snap lead fist straight forward, thumb rolling slightly down at contact, stop 2% before lockout.', breathing: 'Sharp "tsh" exhale' },
      { phase: 'Cross (Rear)', instruction: 'Pivot rear foot, turn hip forward, drive straight punch through center line, bring lead hand to guard.', breathing: 'Sharp "tsh" exhale' }
    ],
    commonMistakes: [
      'Over-extending elbows and hyperextending joint capsules',
      'Dropping non-punching hand to waist, leaving head unprotected',
      'Stiffening shoulders and holding breath'
    ],
    hydrationTip: 'Combat movement creates rapid perspiration; drink water at every break.',
    iconName: 'Zap'
  },
  {
    id: 'shadow_slow_strikes',
    title: 'Slow-Motion Guard & Shadow Mechanics',
    category: 'martial_arts',
    difficulty: 'beginner',
    targetReps: 12,
    demanding: false,
    safetyReminders: [
      'Execute at 30% speed focusing entirely on posture, balance, and breathing.',
      'Check foot placement after every combination.'
    ],
    warmupRequired: 'Gentle neck and shoulder circles.',
    cooldownRecommended: 'Cross-body arm stretch.',
    accessibleDescription: 'Stand in boxing guard and practice slow, deliberate extension of lead jab and rear cross, observing hip rotation and weight transfer.',
    formCues: [
      { phase: 'Movement', instruction: 'Move in slow motion; feel weight transition between lead and rear feet.', breathing: 'Slow deep breathing' }
    ],
    commonMistakes: ['Rushing through repetitions without feeling balance'],
    hydrationTip: 'Hydrate regularly.',
    iconName: 'CheckCircle'
  },

  // MARTIAL ARTS: Muay Thai Roundhouse Kick Chamber
  {
    id: 'muay_thai_roundhouse',
    title: 'Muay Thai Roundhouse Kick Chamber & Pivot',
    category: 'martial_arts',
    difficulty: 'advanced',
    targetReps: 16,
    demanding: true,
    contextualWarning: 'CRITICAL JOINT SAFETY: You MUST pivot your supporting foot at least 90 to 180 degrees outward. Kicking without pivoting forces dangerous rotational torque into your standing knee joint and ACL.',
    safetyReminders: [
      'Never kick high if your hamstring or adductor flexibility is cold or restricted.',
      'Aim for mid-thigh or rib height only; height is not a measure of safety.',
      'If you lose balance, pause immediately and reset your stance.'
    ],
    easierAlternativeId: 'front_teep_kick_low',
    easierAlternativeName: 'Low Front Push Kick (Teep)',
    warmupRequired: 'Hip flexor stretch, leg swings (front-to-back & lateral 10 reps each), and ankle mobility.',
    cooldownRecommended: 'Pigeon pose (60s each side) and standing quad stretch.',
    accessibleDescription: 'From your fighting stance, step 45 degrees outward with lead foot, open hips, pivot on ball of foot while sweeping kicking leg in an arc with shin leading.',
    formCues: [
      { phase: 'Step & Open', instruction: 'Step 45 degrees outside the center line, opening your hip angle.', breathing: 'Inhale' },
      { phase: 'Pivot & Chamber', instruction: 'Rise onto the ball of the support foot and pivot heel forward; keep supporting knee slightly soft.', breathing: 'Exhale sharply' },
      { phase: 'Chamber Return', instruction: 'Control the leg return along the same trajectory back to balanced stance.', breathing: 'Inhale reset' }
    ],
    commonMistakes: [
      'Failing to pivot supporting foot (severe knee torque hazard)',
      'Kicking with toes instead of lower third of shin',
      'Leaning torso backward excessively and compromising lumbar support'
    ],
    hydrationTip: 'Electrolyte water recommended for high-intensity martial arts kicking.',
    iconName: 'Flame'
  },
  {
    id: 'front_teep_kick_low',
    title: 'Low Front Push Kick (Teep)',
    category: 'martial_arts',
    difficulty: 'beginner',
    targetReps: 12,
    demanding: false,
    safetyReminders: [
      'Chamber the knee to chest first before extending forward.',
      'Keep kick low (below waistline) to safeguard balance and hamstring.'
    ],
    warmupRequired: 'Knee hugs and high marching in place.',
    cooldownRecommended: 'Hamstring stretch.',
    accessibleDescription: 'Stand in guard stance. Lift lead knee toward chest, then push the ball of your foot forward at waist height, retracting knee before placing foot down.',
    formCues: [
      { phase: 'Chamber', instruction: 'Raise knee high with toes pulled upward.', breathing: 'Inhale' },
      { phase: 'Extension', instruction: 'Push hips forward slightly and extend ball of foot forward.', breathing: 'Exhale' },
      { phase: 'Retract', instruction: 'Pull knee back to chest before setting foot down under control.', breathing: 'Inhale' }
    ],
    commonMistakes: ['Dropping hands while extending the leg'],
    hydrationTip: 'Hydrate between sets.',
    iconName: 'CheckCircle'
  },

  // MOBILITY & ACTIVE RECOVERY
  {
    id: 'cat_cow_thoracic',
    title: 'Cat-Cow & Thoracic Spine Decompression',
    category: 'active_recovery',
    difficulty: 'beginner',
    targetReps: 10,
    demanding: false,
    safetyReminders: [
      'Move gently within your comfortable pain-free range of motion.',
      'Do not force your neck into excessive backward extension.'
    ],
    warmupRequired: 'Gentle wrist circles (20s).',
    cooldownRecommended: 'Child pose relaxation (60s).',
    accessibleDescription: 'Position yourself on hands and knees on an exercise mat, wrists under shoulders and knees under hips. On inhale, gently drop belly toward floor while gazing forward (Cow). On exhale, arch spine toward ceiling while releasing head downward (Cat).',
    formCues: [
      { phase: 'Cow (Extension)', instruction: 'Inhale, broaden collarbones, gentle anterior tilt of pelvis.', breathing: 'Deep diaphragmatic inhale' },
      { phase: 'Cat (Flexion)', instruction: 'Exhale, press floor away, round upper back like a cat, tuck tailbone.', breathing: 'Full slow exhale' }
    ],
    commonMistakes: ['Moving too fast and turning it into a ballistic exercise'],
    hydrationTip: 'Rehydrate with clean water to support spinal disc hydration.',
    iconName: 'Heart'
  },
  {
    id: 'diaphragmatic_recovery_breathing',
    title: 'Parasympathetic Box Breathing & Cooldown',
    category: 'mobility_cooldown',
    difficulty: 'beginner',
    durationSeconds: 120,
    targetReps: 1,
    demanding: false,
    safetyReminders: [
      'Perform seated or lying flat on your back.',
      'If you feel lightheaded, return to normal natural breathing immediately.'
    ],
    warmupRequired: 'None required.',
    cooldownRecommended: 'Sit quietly for 30 seconds before standing up.',
    accessibleDescription: 'Inhale through your nose for 4 seconds, feeling your lower abdomen expand. Hold your breath for 4 seconds. Exhale slowly through your mouth for 4 seconds. Hold empty lungs for 4 seconds.',
    formCues: [
      { phase: 'Inhale (4s)', instruction: 'Expand belly, relax neck and shoulders.', breathing: '4 count inhale' },
      { phase: 'Hold (4s)', instruction: 'Keep throat open and relaxed.', breathing: '4 count pause' },
      { phase: 'Exhale (4s)', instruction: 'Release all air gently without tension.', breathing: '4 count exhale' },
      { phase: 'Hold (4s)', instruction: 'Rest in quiet stillness.', breathing: '4 count pause' }
    ],
    commonMistakes: ['Chest breathing instead of diaphragmatic belly expansion'],
    hydrationTip: 'Drink water slowly post-session to assist cellular recovery.',
    iconName: 'Shield'
  }
];

export const MISSIONS_LIST = [
  {
    id: 'm1_foundation_safety',
    title: 'Mission 1: Foundational Movement & Posture',
    description: 'Establish core alignment, master controlled pushups, and build stable joint foundations.',
    category: 'calisthenics' as const,
    difficulty: 'beginner' as const,
    exercises: [EXERCISES[1], EXERCISES[3], EXERCISES[6]],
    xpReward: 60,
    recoveryCost: 2,
    completed: false
  },
  {
    id: 'm2_martial_arts_strikes',
    title: 'Mission 2: Martial Arts Defensive Guard & Striking',
    description: 'Learn boxing jab-cross mechanics with mandatory joint protection safeguards and pivoting.',
    category: 'martial_arts' as const,
    difficulty: 'intermediate' as const,
    exercises: [EXERCISES[5], EXERCISES[4], EXERCISES[7]],
    xpReward: 90,
    recoveryCost: 3,
    completed: false
  },
  {
    id: 'm3_active_recovery_flow',
    title: 'Mission 3: Full-Body Decompression & Recovery',
    description: 'Lower fatigue index, decompress the lumbar spine, and restore parasympathetic balance.',
    category: 'active_recovery' as const,
    difficulty: 'beginner' as const,
    exercises: [EXERCISES[6], EXERCISES[7], EXERCISES[3]],
    xpReward: 40,
    recoveryCost: 0,
    completed: false
  },
  {
    id: 'm4_advanced_striking_power',
    title: 'Mission 4: Muay Thai Chambering & Calisthenic Power',
    description: 'Advanced rotational kicking mechanics with strict knee safety pivot checks and full bodyweight pushups.',
    category: 'martial_arts' as const,
    difficulty: 'advanced' as const,
    exercises: [EXERCISES[0], EXERCISES[2], EXERCISES[6]],
    xpReward: 120,
    recoveryCost: 4,
    completed: false
  }
];
