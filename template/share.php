<?php
  
  if (isset($share_data['title'])) {
    $share_title = $share_data['title'];
  } else {
    $share_title = 'Climate Explorer';
  }
  
  if (isset($share_data['url'])) {
    $share_url = $share_data['url'];
  } else {
    $share_url = current_URL();
  }
  
?>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="share-widget">
  <a href="#" class="share-trigger"><span class="icon icon-social"></span>Share</a>
  <ul>
    <li><a href="#" class="share-link share-facebook" data-href="<?php echo $share_url; ?>"><span class="icon icon-facebook"></span>Facebook</a></li>
    <li><a href="https://twitter.com/intent/tweet?text=<?php echo $share_title; ?> via @NOAA Climate Explorer: <?php echo $share_url; ?>" class="share-link share-twitter"><span class="icon icon-twitter"></span>Twitter</a></li>
    <li><a href="#" class="share-link share-linkedin"><span class="icon icon-linkedin"></span>LinkedIn</a></li>
  </ul>
</div>
