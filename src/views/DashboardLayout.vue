<template>
  <div class="dashboard-layout">
    <!-- Navbar lateral fixa -->
    <div class="sidebar">
      <h2>Admin Dashboard</h2>
      <nav>
        <router-link to="/dashboard/vendedores" class="nav-link">Vendedores</router-link>
        <router-link to="/dashboard/vendas" class="nav-link">Vendas</router-link>
        <router-link to="/dashboard/configuracoes" class="nav-link">Configurações</router-link>
      </nav>
    </div>

    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.dashboard-layout {
  display: flex;
  height: 100vh;

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 200px;
    height: 100%;
    background-color: #333;
    color: white;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    h2 {
      color: white;
      font-size: 1.5rem;
      margin-bottom: 2rem;
      text-align: center;
    }

    .nav-link {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      margin-bottom: 1rem;
      display: block;
      border-radius: 4px;

      &:hover {
        background-color: #444;
      }
    }
  }

  .content {
    margin-left: 200px;
    padding: 2rem;
    width: calc(100% - 200px);
  }
}
</style>
