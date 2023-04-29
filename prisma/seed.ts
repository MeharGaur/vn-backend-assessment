import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
    {
        username: 'Alice',
        email: 'alice@viralnation.com',
        password: 'alice123',
        movies: {
            create: [
                {
                    movieName: 'The Shawshank Redemption',
                    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
                    directorName: "David",
                    releaseDate: new Date('2021-03-16T00:00:00.000Z'),
                },
                {
                    movieName: 'The Godfather',
                    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
                    directorName: "David",
                    releaseDate: new Date('2022-08-3T00:00:00.000Z'),
                },
                {
                    movieName: 'The Dark Knight',
                    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
                    directorName: "David",
                },
            ],
        },
    },
    {
        username: 'Bob',
        email: 'bob@viralnation.com',
        password: 'bob123',
        movies: {
            create: [
                {
                    movieName: "Back to the Future",
                    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
                    directorName: "David",
                }
            ],
        },
    },
]


async function main() {
    console.log(`Start seeding ...`)

    for (const userObject of userData) {
        const user = await prisma.user.create({
            data: userObject,
        })

        console.log(`Created user with id: ${user.id}`)
    }

    console.log(`Seeding finished.`)
}


try {
    await main()
    await prisma.$disconnect()
}
catch (error) {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
}

