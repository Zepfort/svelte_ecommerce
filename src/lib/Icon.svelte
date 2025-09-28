<svelte:options namespace="svg" />

<script lang="ts">
  import { icon as iconRender, type IconDefinition } from '@fortawesome/fontawesome-svg-core';
  import { derived } from 'svelte/store';

  interface IconProps {
    icon: IconDefinition;
    class?: string;
  }

  let { icon, class: className }: IconProps = $props();

  // HTML ikon dari definisi ikon
  let iconHtml = iconRender(icon, { classes: className ? [className] : [] }).html;
</script>

{@html iconHtml}

