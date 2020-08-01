<template>
  <div v-if="!item.hidden">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
          (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
          !item.alwaysShow
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <item
            :icon="setIcon"
            :title="onlyOneChild.meta.title"
            :active_icon="item.meta && item.meta.active_icone"
          />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu
      v-else
      ref="subMenu"
      :index="resolvePath(item.path)"
      popper-append-to-body
    >
      <template slot="title">
        <item
          v-if="item.meta"
          :icon="setIcon"
          :active_icon="item.meta && item.meta.active_icone"
          :title="item.meta.title"
        />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from "path";
import { isExternal } from "@/utils/validate";
import Item from "./Item";
import AppLink from "./Link";
import FixiOSBug from "./FixiOSBug";

export default {
  name: "SidebarItem",
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ""
    },
    index: {
      type: [String, Number],
      default: ""
    },
    mouseenterIndex: {
      type: [Object, String],
      default: () => ({})
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null;
    return {};
  },
  computed: {
    setIcon() {
      const {
        path,
        meta: { activeMenu }
      } = this.$route;
      //  console.log(this.$route, this.index, this.item, this.mouseenterIndex);

      if (
        path == this.item.redirect ||
        this.item.path == this.mouseenterIndex.path ||
        this.item.redirect == activeMenu ||
        this.mouseenterIndex.redirect == this.item.redirect
      ) {
        if (
          path != "/index" ||
          this.item.path == this.mouseenterIndex.path ||
          this.mouseenterIndex.redirect == this.item.redirect
        ) {
          return (
            this.onlyOneChild.meta.active_icon ||
            (this.item.meta && this.item.meta.active_icon)
          );
        } else {
          return (
            this.onlyOneChild.meta.icon ||
            (this.item.meta && this.item.meta.icon)
          );
        }
      } else {
        return (
          this.onlyOneChild.meta.icon || (this.item.meta && this.item.meta.icon)
        );
      }
    }
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false;
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item;
          return true;
        }
      });

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true;
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
        return true;
      }

      return false;
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(this.basePath)) {
        return this.basePath;
      }
      return path.resolve(this.basePath, routePath);
    }
  }
};
</script>
