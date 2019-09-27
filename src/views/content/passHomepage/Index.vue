<template>
  <div>
    <Journalism></Journalism>
    <business-documents></business-documents>
    <notice-announcement></notice-announcement>
  </div>
</template>

<script>
  import BusinessDocuments from './BusinessDocuments';
  import Journalism from './Journalism';
  import NoticeAnnouncement from './NoticeAnnouncement';

  export default {
    name: 'index',
    components: {
      BusinessDocuments,
      Journalism,
      NoticeAnnouncement,
    },
  };
</script>

<style scoped>

</style>
