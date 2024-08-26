const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Create users Alice and Bob
  const alice = await prisma.user.create({
    data: {
      email: "alice@prisma.io",
      pseudo: "alice123",
      hash: "hashedpassword1", // Replace with actual hashed password
      role: "BASIC",
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: "bob@prisma.io",
      pseudo: "bob456",
      hash: "hashedpassword2", // Replace with actual hashed password
      role: "BASIC",
    },
  });

  // Create a post for Alice
  const post1 = await prisma.post.create({
    data: {
      title: "Check out Prisma with Next.js",
      Content: "https://www.prisma.io/nextjs",
      published: true,
      authorId: alice.id, // Link the post to Alice
    },
  });

  // Create a post for Bob
  const post2 = await prisma.post.create({
    data: {
      title: "Getting started with Prisma",
      Content: "Prisma is a great tool to work with databases in Node.js.",
      published: true,
      authorId: bob.id, // Link the post to Bob
    },
  });

  // Create 20 comments on post1, some with replies
  for (let i = 1; i <= 20; i++) {
    const comment = await prisma.comment.create({
      data: {
        content: `Comment ${i} on Post 1`,
        authorized: true,
        postId: post1.id,
        authorId: bob.id, // Bob is the author of all these comments
      },
    });

    // Create 2 replies to each comment
    for (let j = 1; j <= 2; j++) {
      await prisma.comment.create({
        data: {
          content: `Reply ${j} to Comment ${i}`,
          authorized: true,
          postId: post1.id,
          parentId: comment.id, // Link this as a reply to the above comment
          authorId: alice.id, // Alice replies to Bob's comments
        },
      });
    }
  }
  // Add the content for the "About Us" page
  const aboutUsContent = await prisma.pageContent.upsert({
    where: { id: "about-us" },
    update: {
      content: "Nous sommes une entreprise dédiée à l'excellence.", // Update the content if necessary
    },
    create: {
      id: "about-us", // Unique ID for the About Us page
      content: "Nous sommes une entreprise dédiée à l'excellence.", // Content for the About Us page
    },
  });

  // Add the content for the "Contact" page
  const contactContent = await prisma.pageContent.upsert({
    where: { id: "contact" },
    update: {
      content: "Contactez-nous pour plus d'informations.", // Update the content if necessary
    },
    create: {
      id: "contact", // Unique ID for the Contact page
      content: "Contactez-nous pour plus d'informations.", // Content for the Contact page
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
