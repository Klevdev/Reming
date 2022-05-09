<template>
  <Header />
  <div class="layout-wrapper h100%">
    <Sidebar />
    <main>
      <h1 class="page-title">
        {{ $route.meta.title }}
      </h1>
      <RouterView />
    </main>
  </div>
  <Bottombar />
</template>

<style scoped>
  .layout-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .page-title {
    margin-bottom: 1em;
    font-weight: bold;
    font-size: 1.2em;
  }
  main {
<<<<<<< HEAD
      padding: 1em 3vw;
      width: 100%;
  }
  @media only screen and (min-width: 600px) {
    main{
      height: 100%;
=======
      padding: 1em 0 calc(60px + 60px + 1em) 3vw;
      width: 100%;
      overflow-y: auto;
  }
  @media only screen and (min-width: 600px) {
    main{
      padding-bottom: calc(60px + 1em);
>>>>>>> development
    }
  }

</style>
