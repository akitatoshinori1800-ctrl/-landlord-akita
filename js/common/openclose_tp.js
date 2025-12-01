document.addEventListener('DOMContentLoaded', function() {
  const menubarHdr = document.getElementById('menubar_hdr');
  const menubarS = document.getElementById('menubar-s');

  menubarHdr.addEventListener('click', function() {
      menubarHdr.classList.toggle('close'); // ボタンのデザインを切り替える
      
      if (menubarS.classList.contains('open')) {
          menubarS.classList.remove('open');
          menubarS.classList.add('close');
      } else {
          menubarS.classList.remove('close');
          menubarS.classList.add('open');
      }
  });
});
