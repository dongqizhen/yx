<template>
  <div class="menu">
    <el-menu-item
      v-if="!item.children || item.children.length == 0"
      :key="item.id"
      :data="item"
      :index="toStrIndex(item.id)"
    >
      <span slot="title"> {{ item.catalogName }} </span>
    </el-menu-item>
    <el-submenu v-else :key="item.id" :data="item" :index="toStrIndex(item.id)">
      <template slot="title">
        <span>{{ item.catalogName }}</span>
      </template>
      <div v-for="data in item.children" :key="data.id">
        <Menu :item="data" />
      </div>
    </el-submenu>
  </div>
</template>

<script>
  export default {
    name: "Menu",
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    data() {
      return {};
    },
    methods: {
      toStrIndex(v) {
        return String(v);
      }
    }
  };
</script>
