import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Seeding database...");

  try {
    // Clear existing data
    await prisma.letter.deleteMany({});
    console.log("Cleared existing letters");

    // Sample letters data
    const letters = [
      {
        name: "Jessie",
        message: "I hope you know someone out there is rooting for you.",
        ip: "192.168.3.1",
      },
      {
        name: "Leo",
        message:
          "I still think about that day. You probably don’t even remember it.",
        ip: "192.168.3.2",
      },
      {
        name: "Mimi",
        message: "Some goodbyes don’t feel finished. This is mine.",
        ip: "192.168.3.3",
      },
      {
        name: "Toby",
        message: "I saw a dog today that reminded me of you. Weird, huh?",
        ip: "192.168.3.4",
      },
      {
        name: "Nina",
        message: "Missed chances hurt the most. Just wanted to say that.",
        ip: "192.168.3.5",
      },
      {
        name: "Zeke",
        message: "Things are heavy lately. Hope you're doing okay.",
        ip: "192.168.3.6",
      },
      {
        name: "Rae",
        message: "You mattered more than you’ll ever know.",
        ip: "192.168.3.7",
      },
      {
        name: "Ollie",
        message: "If you’re reading this, take the risk. Say the thing.",
        ip: "192.168.3.8",
      },
      {
        name: "Luna",
        message: "The stars looked extra soft tonight. Thought of you.",
        ip: "192.168.3.9",
      },
      {
        name: "Ash",
        message: "Sometimes healing looks like letting go. I’m trying.",
        ip: "192.168.3.10",
      },
      {
        name: "Finn",
        message: "I laughed today. First time in a while.",
        ip: "192.168.3.11",
      },
      {
        name: "Tia",
        message: "I wish we had one more walk. Just one.",
        ip: "192.168.3.12",
      },
      {
        name: "Drew",
        message: "It’s weird how fast things change. I hope you're safe.",
        ip: "192.168.3.13",
      },
      {
        name: "Romy",
        message: "Still waiting on that one text. It’s been years.",
        ip: "192.168.3.14",
      },
      {
        name: "Jay",
        message: "Not sure why I’m writing this. Just felt right.",
        ip: "192.168.3.15",
      },
      {
        name: "Ellie",
        message: "You once told me I glow. I never forgot.",
        ip: "192.168.3.16",
      },
      {
        name: "Nico",
        message: "Forgiving you was easier than forgetting you.",
        ip: "192.168.3.17",
      },
      {
        name: "Kiki",
        message: "Hey. I still believe in you.",
        ip: "192.168.3.18",
      },
      {
        name: "Max",
        message: "It’s okay to start over. I’m doing it too.",
        ip: "192.168.3.19",
      },
      {
        name: "Vee",
        message: "Home doesn’t feel like a place anymore.",
        ip: "192.168.3.20",
      },
    ];

    // Create records
    for (const letter of letters) {
      await prisma.letter.create({
        data: letter,
      });
      console.log(`Added letter from ${letter.name}`);
    }

    // Get count of seeded records
    const count = await prisma.letter.count();
    console.log(`Database has been seeded with ${count} letters.`);
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}

// Execute the main function
main()
  .then(async () => {
    // Close the Prisma client connection
    await prisma.$disconnect();
    console.log("Seeding completed and connection closed.");
  })
  .catch(async (e) => {
    console.error("Seeding Error:", e);
    // Close the Prisma client connection
    await prisma.$disconnect();
    process.exit(1);
  });
