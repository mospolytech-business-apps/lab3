<template>
  <UIHeader title="Планировка цехов" />
  <UINav />
  <div class="workroom__head">
    <UISelect v-model="selectedWorkroom" placeholder="Планы цехов" class="status-filter">
      <option value="design">Цех оформления</option>
      <option value="mounting">Цех монтажа тортов</option>
      <option value="packing">Упаковочный цех</option>
      <option value="bakery">Пекарный цех</option>
      <option value="billet">Заготовительный цех</option>
    </UISelect>
    <UIButton @click="deleteAll">Удалить все</UIButton>
    <UIButton>Сохранить</UIButton>
  </div>
  <div v-if="selectedWorkroom" @dragover.prevent @drop="dropBadge" class="workroom__wrapper">
    <div v-for="badge in this.selectedBadges" :key="badge.name" class="scheme__badge"
      :style="{ top: `${Math.abs(rotation%180)==90?badge.x:badge.y}px`, left: `${rotation%180==90?badge.y:badge.x}px` }" draggable @dragstart="dragStart(badge, true)">
      <UIButton class="badge__button-close" @click="deleteBadge(badge.id)">
        <img class="badge__close" src="../assets/cross-icon.png" alt="Delete this badge">
      </UIButton>
      <img class="badge__image" :src="getBadgeImage(badge.name)" alt="Badge">
    </div>
    <img class="scheme__image" ondragstart="return false;" ondrop="return false;" :src="selectedImage" v-if="selectedImage" alt="Selected workroom"
      :style="{ transform: `rotate(${rotation}deg)`, margin: rotation%180==0?`0`:`140px 0` }">
  </div>
  <div v-if="selectedWorkroom" class="badges__wrapper">
    <div v-for="badge in badges" :key="badge.name" class="badge" :draggable="true" @dragstart="dragStart(badge, false)">
      <img class="badge__image" :src="badge.image" :alt="badge.name">
    </div>
  </div>
  <div v-if="selectedWorkroom" class="scheme__actions">
    <UIButton @click="doRatate(-90)">Влево</UIButton>
    <UIButton @click="doRatate(90)">Вправо</UIButton>
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
    UIButton
  },
  data() {
    return {
      allID: 2,
      selectedWorkroom: null,
      rotation: 0,
      badges: [
        {
          name: 'FirstAid',
          image: FirstAid,
        },
        {
          name: 'FireExtinguisher',
          image: FireExtinguisher,
        },
        {
          name: 'Exit',
          image: Exit,
        },
        {
          name: 'Equipment',
          image: Equipment,
        }
      ],
      workrooms: [
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
              y: 50
            },
          ]
        },
        {
          name: "mounting",
          title: "Цех монтажа тортов",
          image: mounting,
          rotation: 0,
          badges: []
        },
        {
          name: "packing",
          title: "Упаковочный цех",
          image: packing,
          rotation: 0,
          badges: []
        },
        {
          name: "bakery",
          title: "Пекарный цех",
          image: bakery,
          rotation: 0,
          badges: []
        },
        {
          name: "billet",
          title: "Заготовительный цех",
          image: billet,
          rotation: 0,
          badges: []
        },
      ],
    };
  },
  computed: {
    selectedRotation() {
      const room = this.workrooms.find((room) => room.name === this.selectedWorkroom);
      return room ? room.rotation : 0;
    },
    selectedImage() {
      const room = this.workrooms.find((room) => room.name === this.selectedWorkroom);
      return room ? room.image : null;
    },
    selectedBadges(){
      if (this.selectedWorkroom) {
          return this.workrooms.find(room => room.name === this.selectedWorkroom).badges
        }
        return [];
    },
  },
  methods: {
    dragStart(badge, deleteValue) {
      badge.delete = deleteValue;
      console.log(badge)
      event.dataTransfer.setData('text/plain', JSON.stringify(badge));
    },
    dropBadge(event) {
      event.preventDefault();
      const badgeData = JSON.parse(event.dataTransfer.getData('text/plain'));
      const rect = event.currentTarget.getBoundingClientRect();
      const mouseX = event.clientX;
      const mouseY = event.clientY;
      const x = mouseX - rect.left;
      const y = mouseY - rect.top;
      const X = Math.abs(this.rotation%180) == 90 ? y - 20 : x - 20; 
      const Y = Math.abs(this.rotation%180) == 90 ? x - 20 : y - 20;
      const selectedRoom = this.workrooms.findIndex((room) => room.name === this.selectedWorkroom);
      const obj = {
        id: this.allID,
        name: badgeData.name,
        x: X,
        y: Y,
      }
      this.allID += 1;
      this.workrooms[selectedRoom].badges.push(obj);
      console.log(this.selectedBadges)
      if (badgeData.delete){
        this.deleteBadge(badgeData.id)
      }
    },
    getBadgeImage(name) {
      const badge = this.badges.find((badge) => badge.name === name);
      return badge ? badge.image : '';
    },
    setBadges(newValue){
        const selectedRoom = this.workrooms.findIndex(room => room.name === this.selectedWorkroom)
        this.workrooms[selectedRoom].badges = newValue
    },
    deleteAll(){
      const selectedRoom = this.workrooms.findIndex(room => room.name === this.selectedWorkroom)
      this.workrooms[selectedRoom].badges = []
    },
    deleteBadge(id){
      console.log(id)
      const selectedRoom = this.workrooms.findIndex(room => room.name === this.selectedWorkroom)
      this.workrooms[selectedRoom].badges = this.workrooms[selectedRoom].badges.filter(item => item.id !== id);
    },
    doRatate(val){
      this.rotation += val;
    }
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

.workroom__wrapper {
  transform-origin: center;
  position: relative;
  width: 600px;
  height: 600px;
  border: 1px dashed #ccc;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  align-content: center;
}

.badges__wrapper {
  display: flex;
  align-items: center;
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

.badge__image {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
.workroom__head {
  display: flex;
  gap: 10px;
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

.scheme__badge:hover .badge__button-close{
  display: block;
}

.scheme__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
