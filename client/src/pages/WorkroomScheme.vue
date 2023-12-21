<template>
  <UIHeader title="Планировка цехов" />
  <UINav />
  <div class="page">
    <div class="workroom__head">
      <UISelect v-model="selectedWorkroom" class="status-filter">
        <option value="design">Цех оформления</option>
        <option value="mounting">Цех монтажа тортов</option>
        <option value="packing">Упаковочный цех</option>
        <option value="bakery">Пекарный цех</option>
        <option value="billet">Заготовительный цех</option>
      </UISelect>
      <UIButton @click="deleteAll">Удалить все</UIButton>
      <UIButton>Сохранить</UIButton>
    </div>
    <div>
      <div
        v-if="selectedWorkroom"
        @dragover.prevent
        @drop="dropBadge"
        class="workroom__wrapper"
      >
        <div
          v-for="badge in this.selectedBadges"
          :key="badge.name"
          class="scheme__badge"
          :style="{
            top: `calc(50% + ${
              Math.sin((rotation * Math.PI) / 180) * badge.x -
              Math.cos((rotation * Math.PI) / 180) * badge.y
            }px)`,
            left: `calc(50% + ${
              Math.cos((rotation * Math.PI) / 180) * badge.x +
              Math.sin((rotation * Math.PI) / 180) * badge.y
            }px)`,
          }"
          draggable
          @dragstart="dragStart(badge, true)"
        >
          <UIButton class="badge__button-close" @click="deleteBadge(badge.id)">
            <img
              class="badge__close"
              src="../assets/cross-icon.png"
              alt="Delete this badge"
            />
          </UIButton>
          <img
            class="badge__image"
            :src="getBadgeImage(badge.name)"
            :style="{
              transform: `rotate(${rotation}deg)`,
            }"
            alt="Badge"
          />
        </div>
        <img
          class="scheme__image"
          ondragstart="return false;"
          ondrop="return false;"
          :src="selectedImage"
          v-if="selectedImage"
          alt="Selected workroom"
          :style="{
            transform: `rotate(${rotation}deg)`,
          }"
        />
      </div>
      <div v-if="selectedWorkroom" class="badges__wrapper">
        <div
          v-for="badge in badges"
          :key="badge.name"
          class="badge"
          :draggable="true"
          @dragstart="dragStart(badge, false)"
        >
          <img class="badge__image" :src="badge.image" :alt="badge.name" />
        </div>
      </div>
    </div>
    <div v-if="selectedWorkroom" class="scheme__actions">
      <UIButton @click="doRotate(-90)">Влево</UIButton>
      <UIButton @click="doRotate(90)">Вправо</UIButton>
    </div>
  </div>
</template>

<script>
import UIHeader from "@/components/UIHeader.vue";
import UINav from "@/components/UINav.vue";
import UISelect from "@/components/UISelect.vue";
import UIButton from "@/components/UIButton.vue";

import design from "@/assets/workrooms/design.png";
import mounting from "@/assets/workrooms/mounting.png";
import packing from "@/assets/workrooms/packing.png";
import bakery from "@/assets/workrooms/bakery.png";
import billet from "@/assets/workrooms/billet.png";

import FirstAid from "@/assets/badges/FirstAid.png";
import FireExtinguisher from "@/assets/badges/FireExtinguisher.png";
import Exit from "@/assets/badges/Exit.jpg";
import Equipment from "@/assets/badges/Equipment.png";

export default {
  components: {
    UIHeader,
    UINav,
    UISelect,
    UIButton,
  },
  data() {
    return {
      allID: 2,
      selectedWorkroom: "design",
      rotation: 0,
      badges: [
        {
          name: "FirstAid",
          image: FirstAid,
        },
        {
          name: "FireExtinguisher",
          image: FireExtinguisher,
        },
        {
          name: "Exit",
          image: Exit,
        },
        {
          name: "Equipment",
          image: Equipment,
        },
      ],
      workrooms: JSON.parse(localStorage.getItem("workrooms")) || [
        {
          name: "design",
          title: "Цех оформления",
          image: design,
          rotation: 0,
          badges: [
            {
              id: 1,
              name: "FirstAid",
              x: 50,
              y: 50,
            },
          ],
        },
        {
          name: "mounting",
          title: "Цех монтажа тортов",
          image: mounting,
          rotation: 0,
          badges: [],
        },
        {
          name: "packing",
          title: "Упаковочный цех",
          image: packing,
          rotation: 0,
          badges: [],
        },
        {
          name: "bakery",
          title: "Пекарный цех",
          image: bakery,
          rotation: 0,
          badges: [],
        },
        {
          name: "billet",
          title: "Заготовительный цех",
          image: billet,
          rotation: 0,
          badges: [],
        },
      ],
    };
  },
  computed: {
    selectedRotation() {
      const room = this.workrooms.find(
        (room) => room.name === this.selectedWorkroom
      );
      return room ? room.rotation : 0;
    },
    selectedImage() {
      const room = this.workrooms.find(
        (room) => room.name === this.selectedWorkroom
      );
      return room ? room.image : null;
    },
    selectedBadges() {
      if (this.selectedWorkroom) {
        return this.workrooms.find(
          (room) => room.name === this.selectedWorkroom
        ).badges;
      }
      return [];
    },
  },
  methods: {
    dragStart(badge, deleteValue) {
      badge.delete = deleteValue;
      event.dataTransfer.setData("text/plain", JSON.stringify(badge));
    },
    dropBadge(event) {
      event.preventDefault();
      const badgeData = JSON.parse(event.dataTransfer.getData("text/plain"));
      const rect = event.currentTarget.getBoundingClientRect();
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      const x = mouseX - rect.left * 1.68;
      const y = mouseY - rect.top * 1.68 - 40;

      const rotatedX =
        Math.cos((this.rotation * Math.PI) / 180) * x +
        Math.sin((this.rotation * Math.PI) / 180) * y;
      const rotatedY =
        Math.sin((this.rotation * Math.PI) / 180) * x -
        Math.cos((this.rotation * Math.PI) / 180) * y;

      console.log(x, y, rotatedX, rotatedY);
      const selectedRoom = this.workrooms.findIndex(
        (room) => room.name === this.selectedWorkroom
      );
      const obj = {
        id: this.allID,
        name: badgeData.name,
        x: rotatedX,
        y: rotatedY,
      };
      this.allID += 1;
      this.workrooms[selectedRoom].badges.push(obj);
      if (badgeData.delete) {
        this.deleteBadge(badgeData.id);
      }

      localStorage.setItem("workrooms", JSON.stringify(this.workrooms));
    },
    getBadgeImage(name) {
      const badge = this.badges.find((badge) => badge.name === name);
      return badge ? badge.image : "";
    },
    setBadges(newValue) {
      const selectedRoom = this.workrooms.findIndex(
        (room) => room.name === this.selectedWorkroom
      );
      this.workrooms[selectedRoom].badges = newValue;
    },
    deleteAll() {
      const selectedRoom = this.workrooms.findIndex(
        (room) => room.name === this.selectedWorkroom
      );
      this.workrooms[selectedRoom].badges = [];
      localStorage.setItem("workrooms", JSON.stringify(this.workrooms));
    },
    deleteBadge(id) {
      const selectedRoom = this.workrooms.findIndex(
        (room) => room.name === this.selectedWorkroom
      );
      this.workrooms[selectedRoom].badges = this.workrooms[
        selectedRoom
      ].badges.filter((item) => item.id !== id);
    },
    doRotate(val) {
      this.rotation += val;
    },
  },
};
</script>

<style scoped>
.main {
  margin: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  gap: 1rem;
}

.page {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.workroom__wrapper {
  position: relative;
  margin: 0 auto;
  display: flex;
  max-height: 50rem;
  flex-wrap: wrap;
  padding: 10px;
  align-content: center;
}

.scheme__image {
  width: 500px;
  height: 500px;
  object-fit: contain;
}

.badges__wrapper {
  justify-content: center;
  display: flex;
  align-items: center;
  margin-top: 6rem;
  gap: 10px;
}

.badge {
  cursor: pointer;
  width: 40px;
  height: 40px;
}

.scheme__badge {
  position: absolute;
  cursor: move;
  width: 40px;
  height: 40px;
  z-index: 4;
}

.status-filter {
  margin-right: auto;
}

.badge__image {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
.workroom__head {
  display: flex;
  width: 100%;
  gap: 10px;
  margin-top: 2rem;
  padding-inline: 2rem;
  flex-wrap: wrap;
}

.badge__close {
  height: 14px;
  max-width: 14px;
}

.badge__button-close {
  position: absolute;
  padding: 2px;
  top: -20px;
  right: 0;
  display: none;
}

.scheme__badge:hover .badge__button-close {
  display: block;
}

.scheme__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}
</style>
