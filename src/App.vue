<script setup></script>

<template>
    <div class="app">
        <nav class="nav">
            <div class="brand">MMI World</div>
            <div class="links">
                <router-link to="/">Accueil</router-link>
                <router-link :to="{ name: 'about' }">À propos</router-link>
                <router-link :to="{ name: 'pays' }">Pays</router-link>
                <router-link :to="{ name: 'recherche' }">Recherche</router-link>
            </div>
        </nav>

        <main class="content">
            <router-view></router-view>
        </main>
    </div>
</template>

<style scoped>
.app {
    min-height: 100vh;
    background: #f8fafc;
    color: #0f172a;
}

.nav {
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 2rem;
    background: #ffffff;
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
    z-index: 10;
}

.brand {
    font-weight: 700;
    letter-spacing: 0.3px;
    color: #1e293b;
}

.links {
    display: flex;
    gap: 0.75rem;
}

.nav a {
    font-weight: 600;
    color: #0f766e;
    text-decoration: none;
    padding: 0.35rem 0.6rem;
    border-radius: 8px;
    transition: background 0.2s ease, color 0.2s ease;
}

.nav a:hover {
    background: #ecfeff;
    color: #0e7490;
}

.nav a.router-link-active {
    background: #0f766e;
    color: #ffffff;
}

.content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}
</style>
