<template>
  <div
    class="
      Navbar
      navbar
      d-flex
      align-items-center
      mx
      rounded-2
      mt-2
      justify-between
      bg-secondary
      px-4
    "
    style="height: 50px"
  >
    <!-- Left side navbar -->
    <div class="d-flex gap-3 text-white">
      <svg
        data-v-1134b199=""
        xmlns="http://www.w3.org/2000/svg"
        width="21px"
        height="21px"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-calendar"
      >
        <rect
          data-v-1134b199=""
          x="3"
          y="4"
          width="18"
          height="18"
          rx="2"
          ry="2"
        />
        <line
          data-v-1134b199=""
          x1="16"
          y1="2"
          x2="16"
          y2="6"
        />
        <line
          data-v-1134b199=""
          x1="8"
          y1="2"
          x2="8"
          y2="6"
        />
        <line
          data-v-1134b199=""
          x1="3"
          y1="10"
          x2="21"
          y2="10"
        />
      </svg>
      <svg
        data-v-1134b199=""
        xmlns="http://www.w3.org/2000/svg"
        width="21px"
        height="21px"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-message-square"
      >
        <path
          data-v-1134b199=""
          d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        />
      </svg>
      <svg
        data-v-1134b199=""
        xmlns="http://www.w3.org/2000/svg"
        width="21px"
        height="21px"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-mail"
      >
        <path
          data-v-1134b199=""
          d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        />
        <polyline
          data-v-1134b199=""
          points="22,6 12,13 2,6"
        />
      </svg>
      <svg
        data-v-1134b199=""
        xmlns="http://www.w3.org/2000/svg"
        width="21px"
        height="21px"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-check-square"
      >
        <polyline
          data-v-1134b199=""
          points="9 11 12 14 22 4"
        />
        <path
          data-v-1134b199=""
          d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
        />
      </svg>
      <svg
        data-v-1134b199=""
        xmlns="http://www.w3.org/2000/svg"
        width="21px"
        height="21px"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-star text-warning"
      >
        <polygon
          data-v-1134b199=""
          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        />
      </svg>
    </div>

    <!-- Right side navbar -->
    <div class="d-flex gap-3 text-white">
      <div class="lang d-flex align-items-center gap-2">
        <img
          src="../../assets/icons/ru.jpeg"
          alt="usa flag"
          style="width: 25px; height: 18px"
        >
        <small class="language">English</small>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21px"
        height="21px"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-moon"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      <svg
        data-v-0e8a7f4f=""
        xmlns="http://www.w3.org/2000/svg"
        width="21px"
        height="21px"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-search"
      >
        <circle
          data-v-0e8a7f4f=""
          cx="11"
          cy="11"
          r="8"
        />
        <line
          data-v-0e8a7f4f=""
          x1="21"
          y1="21"
          x2="16.65"
          y2="16.65"
        />
      </svg>

      <div class="position-relative">
        <svg
          data-v-a58fee00=""
          xmlns="http://www.w3.org/2000/svg"
          width="21px"
          height="21px"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-shopping-cart"
        >
          <circle
            data-v-a58fee00=""
            cx="9"
            cy="21"
            r="1"
          />
          <circle
            data-v-a58fee00=""
            cx="20"
            cy="21"
            r="1"
          />
          <path
            data-v-a58fee00=""
            d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
          />
        </svg>
        <span
          data-v-a58fee00=""
          class="
            badge
            position-absolute
            start-100
            translate-middle
            rounded-pill
            top-0
            bg-primary
          "
        >5</span>
      </div>

      <div class="position-relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21px"
          height="21px"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-bell"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span
          data-v-a58fee00=""
          class="
            badge
            position-absolute
            start-100
            translate-middle
            rounded-pill
            top-0
            bg-danger
          "
        >6</span>
      </div>

      <!--
        <div class="d-inline-flex flex-column">
        <div class="user-name font-weight-bolder mb-0">John Doe</div>
        <small class="user-status">Admin</small>
        </div>
        <span
        class="b-avatar badge-minimal badge-light-primary rounded-circle"
        style="width: 40px; height: 40px"
        >
        <span class="b-avatar-img">
        <img src="/img/13-small.d796bffd.png" alt="avatar"
        /></span>
        <span
        class="b-avatar-badge badge-success"
        style="font-size: calc(11.2px); bottom: 0px; right: 0px"
        ></span>
        </span> 
      -->
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    return {}
  },
}
</script>

<style>
.Navbar {
  width: 100% !important;
}
.user-status,
.language {
  font-size: smaller;
}
</style>