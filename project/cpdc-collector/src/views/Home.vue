<template>
  <v-card >
	<h1 v-for="o in 100"> this is a home page in {{o}}</h1>
  </v-card>
</template>
<script>


export default {
  name: 'Home',

  data: () => ({
    //
  }),
};
</script>
