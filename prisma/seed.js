const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Créer ou mettre à jour les utilisateurs Alice et Bob
  const alice = await prisma.user.upsert({
    where: { email: "alice@prisma.io" },
    update: {},
    create: {
      email: "alice@prisma.io",
      pseudo: "alice123",
      hash: "hashedpassword1", // Remplacez ceci par le vrai hash de mot de passe
      role: "BASIC",
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@prisma.io" },
    update: {},
    create: {
      email: "bob@prisma.io",
      pseudo: "bob456",
      hash: "hashedpassword2", // Remplacez ceci par le vrai hash de mot de passe
      role: "BASIC",
    },
  });

  // Créer des posts pour Alice
  const post1 = await prisma.post.create({
    data: {
      title: "Check out Prisma with Next.js",
      Content: "https://www.prisma.io/nextjs",
      published: true,
      author: {
        connect: { email: "alice@prisma.io" }, // Liaison du post à Alice
      },
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: "Getting started with Prisma",
      Content: "Prisma is a great tool to work with databases in Node.js.",
      published: true,
      author: {
        connect: { email: "alice@prisma.io" }, // Liaison du post à Alice
      },
    },
  });

  // Créer des posts pour Bob
  const post3 = await prisma.post.create({
    data: {
      title: "Follow Prisma on Twitter",
      Content: "https://twitter.com/prisma",
      published: true,
      author: {
        connect: { email: "bob@prisma.io" }, // Liaison du post à Bob
      },
    },
  });

  const post4 = await prisma.post.create({
    data: {
      title: "Follow Nexus on Twitter",
      Content: "https://twitter.com/nexusgql",
      published: true,
      author: {
        connect: { email: "bob@prisma.io" }, // Liaison du post à Bob
      },
    },
  });

  // Ajouter des commentaires aux posts
  await prisma.comment.create({
    data: {
      content: "Great article! Very informative.",
      post: {
        connect: { id: post1.id }, // Liaison du commentaire au post1
      },
      author: {
        connect: { email: "bob@prisma.io" }, // Liaison du commentaire à Bob
      },
    },
  });

  await prisma.comment.create({
    data: {
      content: "Thanks for sharing, Alice!",
      post: {
        connect: { id: post1.id },
      },
      author: {
        connect: { email: "bob@prisma.io" },
      },
    },
  });

  await prisma.comment.create({
    data: {
      content: "I agree, Prisma is awesome!",
      post: {
        connect: { id: post2.id }, // Liaison du commentaire au post2
      },
      author: {
        connect: { email: "bob@prisma.io" }, // Liaison du commentaire à Bob
      },
    },
  });

  await prisma.comment.create({
    data: {
      content: "Looking forward to trying this out.",
      post: {
        connect: { id: post2.id },
      },
      author: {
        connect: { email: "bob@prisma.io" },
      },
    },
  });

  await prisma.comment.create({
    data: {
      content: "Done! Already following.",
      post: {
        connect: { id: post3.id }, // Liaison du commentaire au post3
      },
      author: {
        connect: { email: "alice@prisma.io" }, // Liaison du commentaire à Alice
      },
    },
  });

  await prisma.comment.create({
    data: {
      content: "Prisma updates are always helpful.",
      post: {
        connect: { id: post3.id },
      },
      author: {
        connect: { email: "alice@prisma.io" },
      },
    },
  });

  await prisma.comment.create({
    data: {
      content: "Nexus is a great project too!",
      post: {
        connect: { id: post4.id }, // Liaison du commentaire au post4
      },
      author: {
        connect: { email: "alice@prisma.io" }, // Liaison du commentaire à Alice
      },
    },
  });

  await prisma.comment.create({
    data: {
      content: "Excited to see more content from Nexus.",
      post: {
        connect: { id: post4.id },
      },
      author: {
        connect: { email: "alice@prisma.io" },
      },
    },
  });

  // Ajouter le contenu de la page "About Us"
  const aboutUsContent = await prisma.pageContent.upsert({
    where: { id: "about-us" }, // Vous pouvez utiliser un slug ou un identifiant unique
    update: {
      content: "Nous sommes une entreprise dédiée à l'excellence.", // Mettez à jour le contenu si nécessaire
    },
    create: {
      id: "about-us", // ID unique pour la page About Us
      content: "Nous sommes une entreprise dédiée à l'excellence.", // Contenu de la page About Us
    },
  });

  // Ajouter le contenu de la page "Contact"
  const contactContent = await prisma.pageContent.upsert({
    where: { id: "contact" }, // ID unique pour la page Contact
    update: {
      content: "Contactez-nous pour plus d'informations.", // Mettez à jour le contenu si nécessaire
    },
    create: {
      id: "contact", // ID unique pour la page Contact
      content: "Contactez-nous pour plus d'informations.", // Contenu de la page Contact
    },
  });

  console.log({
    alice,
    bob,
    post1,
    post2,
    post3,
    post4,
    aboutUsContent,
    contactContent,
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
