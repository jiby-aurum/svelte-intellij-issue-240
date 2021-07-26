<script lang="ts">
    import {Logger} from "./Logger.js";
    import {onMount} from "../node_modules/svelte/index.mjs";

    export let logger: Logger;

    onMount(() => {
        logger.log('NotOk Component')
    })
</script>