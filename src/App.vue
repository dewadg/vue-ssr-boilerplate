<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
* {
  font-size: 13px;
}

body {
  height: 100vh;
  margin: 0;
  background: #eaeaea;
  font-family: sans-serif;
  color: #444;

  #app {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
}
</style>
