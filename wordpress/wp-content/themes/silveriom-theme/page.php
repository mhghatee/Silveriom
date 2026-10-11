<?php
/**
 * Silveriom Standard Page Template (Elementor Ready)
 */
get_header(); ?>

<div class="silveriom-page-container">
    <?php
    while (have_posts()) : the_post();
        the_content();
    endwhile;
    ?>
</div>

<?php get_footer(); ?>
