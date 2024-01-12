<template>
    <table>
      <thead>
        <tr>
          <th>Оборудование \ Мин</th>
          <th>0</th>
          <th>5</th>
          <th>10</th>
          <th>15</th>
          <th>20</th>
          <th>25</th>
          <th>30</th>
          <th>35</th>
          <th>40</th>
          <th>45</th>
          <th>50</th>
          <th>55</th>
          <th>60</th>
          <th>65</th>
          <th>70</th>
          <th>75</th>
          <th>80</th>
          <th>85</th>
          <th>90</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>Миксер №1</td>
          <td class="red" colspan="3">Крем (взбивание)</td>
          <td v-for="n in 16"></td>
        </tr>
        <tr>
          <td>Миксер №2</td>
          <td class="yellow" colspan="2">Глазурь (взбивание)</td>
          <td v-for="n in 17"></td>
        </tr>
        <tr>
          <td>Духовая печь №1</td>
          <td class="green" colspan="6">Коржи (выпекание)</td>
          <td v-for="n in 13"></td>
        </tr>
        <tr>
          <td>Без оборудования</td>
          <td v-for="n in 6"></td>
          <td class="gray" colspan="4">Непропитанный торт (монтаж тортов)</td>
          <td v-for="n in 9"></td>
        </tr>
      </tbody>
      <h3 class="min-time">Минимальное время производства: 45 минут</h3>
    </table>
</template>

<style scoped>

</style>