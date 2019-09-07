<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
@import 'assets/scss/mixins.scss';
  html, body {
    overflow-x: hidden;
    font-family: 'Montserrat', sans-serif;
    background-color: #f4f7f6;
  }

  #app {
    margin-top: 1rem;
  }
</style>
