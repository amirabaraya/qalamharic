import bcrypt from "bcryptjs";
import { PrismaClient, ExerciseType, Level } from "@prisma/client";

const prisma = new PrismaClient();

type SeedExercise = {
  type: ExerciseType;
  prompt: string;
  amharicText?: string;
  transliteration?: string;
  englishText?: string;
  options?: string[];
  answer: string[];
  explanation?: string;
};

type SeedLesson = {
  slug: string;
  title: string;
  description: string;
  xpReward: number;
  durationMin: number;
  order: number;
  exercises: SeedExercise[];
};

type SeedUnit = {
  slug: string;
  title: string;
  description: string;
  level: Level;
  order: number;
  lessons: SeedLesson[];
};

async function main() {
  const passwordHash = await bcrypt.hash("fidelamharic-demo", 12);

  const user = await prisma.user.upsert({
    where: { email: "maya@example.com" },
    update: {},
    create: {
      name: "Maya Tesfaye",
      email: "maya@example.com",
      passwordHash,
      xp: 4280,
      streak: 18,
      hearts: 4,
      dailyGoal: 45
    }
  });

  const units: SeedUnit[] = [
    {
      slug: "roots-greetings",
      title: "Roots and greetings",
      description: "Fidel sounds, respectful greetings, and warm everyday introductions.",
      level: Level.BEGINNER,
      order: 1,
      lessons: [
        {
          slug: "greeting-with-warmth",
          title: "Greeting with warmth",
          description: "Use ሰላም ነው? and answer naturally.",
          xpReward: 25,
          durationMin: 8,
          order: 1,
          exercises: [
            {
              type: ExerciseType.MULTIPLE_CHOICE,
              prompt: "Choose the warm everyday greeting.",
              amharicText: "ሰላም ነው?",
              transliteration: "Selam new?",
              englishText: "How are you?",
              options: ["ሰላም ነው?", "ውሃ ነው?", "ቤት ነው?", "እንጀራ ነው?"],
              answer: ["ሰላም ነው?"],
              explanation: "Literally, this asks if there is peace."
            },
            {
              type: ExerciseType.PRONUNCIATION,
              prompt: "Record the phrase and match the rhythm.",
              amharicText: "ሰላም ነው?",
              transliteration: "Selam new?",
              englishText: "How are you?",
              answer: ["selam new"]
            }
          ]
        }
      ]
    },
    {
      slug: "market-coffee",
      title: "At the market",
      description: "Numbers, prices, bargaining politely, and coffee vocabulary.",
      level: Level.BEGINNER,
      order: 2,
      lessons: [
        {
          slug: "market-numbers",
          title: "Market numbers",
          description: "Recognize and use prices from one to twenty.",
          xpReward: 30,
          durationMin: 10,
          order: 1,
          exercises: [
            {
              type: ExerciseType.TRANSLATION,
              prompt: "Translate: ten birr",
              amharicText: "አስር ብር",
              transliteration: "Asir birr",
              englishText: "Ten birr",
              options: ["አስር ብር", "ሁለት ብር", "አንድ ቤት", "ቡና ነው"],
              answer: ["አስር ብር"]
            }
          ]
        }
      ]
    },
    {
      slug: "family-home",
      title: "Family and home",
      description: "Possessives, household words, and polite requests.",
      level: Level.LOWER_INTERMEDIATE,
      order: 3,
      lessons: [
        {
          slug: "my-family",
          title: "My family",
          description: "Say my mother, my father, and our home.",
          xpReward: 35,
          durationMin: 12,
          order: 1,
          exercises: [
            {
              type: ExerciseType.FLASHCARD,
              prompt: "What does እናቴ mean?",
              amharicText: "እናቴ",
              transliteration: "Enate",
              englishText: "My mother",
              options: ["My mother", "Your book", "Our coffee", "His home"],
              answer: ["My mother"]
            }
          ]
        }
      ]
    }
  ];

  for (const unit of units) {
    const createdUnit = await prisma.courseUnit.upsert({
      where: { slug: unit.slug },
      update: {
        title: unit.title,
        description: unit.description,
        level: unit.level,
        order: unit.order
      },
      create: {
        slug: unit.slug,
        title: unit.title,
        description: unit.description,
        level: unit.level,
        order: unit.order
      }
    });

    for (const lesson of unit.lessons) {
      const createdLesson = await prisma.lesson.upsert({
        where: { slug: lesson.slug },
        update: {
          title: lesson.title,
          description: lesson.description,
          xpReward: lesson.xpReward,
          durationMin: lesson.durationMin,
          order: lesson.order,
          published: true,
          unitId: createdUnit.id
        },
        create: {
          slug: lesson.slug,
          title: lesson.title,
          description: lesson.description,
          xpReward: lesson.xpReward,
          durationMin: lesson.durationMin,
          order: lesson.order,
          published: true,
          unitId: createdUnit.id
        }
      });

      await prisma.exercise.deleteMany({ where: { lessonId: createdLesson.id } });
      await prisma.exercise.createMany({
        data: lesson.exercises.map((exercise, index) => ({
          lessonId: createdLesson.id,
          type: exercise.type,
          prompt: exercise.prompt,
          amharicText: exercise.amharicText,
          transliteration: exercise.transliteration,
          englishText: exercise.englishText,
          options: exercise.options ?? undefined,
          answer: exercise.answer,
          explanation: exercise.explanation,
          order: index + 1
        }))
      });

      await prisma.progress.upsert({
        where: {
          userId_lessonId: {
            userId: user.id,
            lessonId: createdLesson.id
          }
        },
        update: {},
        create: {
          userId: user.id,
          lessonId: createdLesson.id,
          percent: lesson.order === 1 ? 72 : 0,
          correct: 8,
          attempts: 9
        }
      });
    }
  }

  const badges = [
    ["fidel-keeper", "Fidel Keeper", "Finished the first fidel sequence."],
    ["coffee-chat", "Coffee Chat", "Completed a market coffee conversation."],
    ["streak-18", "18-Day Flame", "Kept an 18 day streak."]
  ] as const;

  for (const [slug, name, description] of badges) {
    const badge = await prisma.badge.upsert({
      where: { slug },
      update: { name, description },
      create: { slug, name, description }
    });

    await prisma.userBadge.upsert({
      where: {
        userId_badgeId: {
          userId: user.id,
          badgeId: badge.id
        }
      },
      update: {},
      create: {
        userId: user.id,
        badgeId: badge.id
      }
    });
  }

  await prisma.reviewCard.deleteMany({ where: { userId: user.id } });
  await prisma.reviewCard.createMany({
    data: [
      { userId: user.id, front: "Coffee", back: "ቡና", strength: 84, intervalDays: 3 },
      { userId: user.id, front: "Thank you", back: "አመሰግናለሁ", strength: 68, intervalDays: 2 },
      { userId: user.id, front: "My home", back: "ቤቴ", strength: 41, intervalDays: 1 }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
