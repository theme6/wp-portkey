<?php get_header(); ?>

<?php if (!is_singular()) {
	query_posts( 'nopaging=1' );
} ?>

<div class="entries row">
<?php if ( have_posts() ) : ?>
	<?php /* Start the Loop */ ?>
	<?php while ( have_posts() ) : the_post(); ?>

		<article id="post-<?php the_ID(); ?>" <?php post_class('entry'); ?>>
			<header class="entry__header">
				<h1 class="entry__title"><a href="<?php the_permalink(); ?>" rel="bookmark"><?php the_title(); ?></a></h1>
			</header>
			<div class="entry__content">
				<?php the_content(); ?>
			</div>
		</article>

	<?php endwhile; ?>

<?php else : ?>

	<p><?php _e( 'It seems we can&rsquo;t find what you&rsquo;re looking for. Perhaps searching can help.', 'wp-port' ); ?></p>
	<?php get_search_form(); ?>

<?php endif; ?>
</div>

<?php get_footer(); ?>
