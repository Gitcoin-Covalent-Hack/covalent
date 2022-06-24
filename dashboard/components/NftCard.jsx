const NftCard = () => {
    return(
        <article class="bg-card w-80 p-6 rounded grid gap-y-6 text-base">
        <header class="flex justify-center">
            <figure>
                <img class="w-full" src="/images/image-equilibrium.jpg" alt="image-equilibrium" />
                <figcaption class="mt-6 text-white text-2xl">Equilibrium #3429</figcaption>
            </figure>
        </header>
        <main class="grid gap-y-6">
            <p class="text-secondary text-lg">Our Equilibrium collection promotes calm and balance.</p>
            <div class="flex justify-between">
                <p class="text-cyan flex gap-x-2 items-center">
                    <span>
                        <img src="/images/icon-ethereum.svg" alt="ethereum icon" />
                    </span>
                    0.041 ETH
                </p>
                <p class="text-secondary flex gap-x-2 items-center">
                    <span>
                        <img src="/images/icon-clock.svg" alt="clock icon" />
                    </span>
                    3 days left
                </p>
            </div>
        </main>
        <footer class="border-t-2 border-gray-700 py-4">
            <figure class="flex gap-x-4 items-center">
                <img class="w-8 h-8" src="/images/image-avatar.png" alt="avatar" />
                <figcaption class="text-secondary">Creation of <span class="text-white">Jules Wyvern</span></figcaption>
            </figure>
        </footer>
    </article>
    )
}

export default NftCard;