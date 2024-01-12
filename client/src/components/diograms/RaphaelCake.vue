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
          <td class="red" colspan="4">Коржи (взбивание)</td>
          <td class="yellow" colspan="4">Крем для украшения (взбивание)</td>
          <td v-for="n in 11"></td>
        </tr>
        <tr>
          <td>Миксер №2</td>
          <td class="green" colspan="6">Основной крем (взбивание)</td>
          <td v-for="n in 13"></td>
        </tr>
        <tr>
          <td>Духовая печь №1</td>
          <td v-for="n in 4"></td>
          <td class="red" colspan="8">Коржи (выпекание)</td>
          <td v-for="n in 7"></td>
        </tr>
        <tr>
          <td>Без оборудования</td>
          <td v-for="n in 12"></td>
          <td class="gray" colspan="6">Непропитанный торт (монтаж тортов)</td>
          <td></td>
        </tr>
      </tbody>
      <h3 class="min-time">Минимальное время производства: 85 минут</h3>
    </table>
</template>

<style scoped>

</style>