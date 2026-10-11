<?php
/**
 * Silveriom Main Template Index
 */
get_header(); ?>

<div class="silveriom-content-wrapper" style="padding-top:100px; min-height:70vh; max-width:1200px; margin:0 auto; padding-inline:20px;">
    <?php
    if (have_posts()) :
        while (have_posts()) : the_post();
            the_content();
        endwhile;
    else :
        echo '<p style="text-align:center; color:#8E9BAE; margin-top:50px;">محتوایی یافت نشد.</p>';
    endif;
    ?>
</div>

<?php get_footer(); ?>
