<?php
function e($v): string { return htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8'); }
function money($n): string { return '$'.number_format((float)$n, 0, ',', '.').' COP'; }
function redirect(string $to): never { header('Location: '.BASE_URL.'/?page='.urlencode($to)); exit; }
function csrf_token(): string { if(empty($_SESSION['_csrf'])) $_SESSION['_csrf']=bin2hex(random_bytes(32)); return $_SESSION['_csrf']; }
function csrf_field(): string { return '<input type="hidden" name="_csrf" value="'.e(csrf_token()).'">'; }
function verify_csrf(): void { if($_SERVER['REQUEST_METHOD']==='POST' && !hash_equals($_SESSION['_csrf'] ?? '', $_POST['_csrf'] ?? '')) { http_response_code(419); exit('La sesión del formulario expiró. Recarga e inténtalo nuevamente.'); } }
function flash(string $message, string $type='success'): void { $_SESSION['_flash']=['message'=>$message,'type'=>$type]; }
function take_flash(): ?array { $f=$_SESSION['_flash']??null; unset($_SESSION['_flash']); return $f; }
function require_login(): void { if(empty($_SESSION['user'])) redirect('login'); }
function require_admin(): void { require_login(); if(($_SESSION['user']['role']??'user')!=='admin') { http_response_code(403); exit('No tienes permiso para acceder a esta sección.'); } }
function current_user(): array { return $_SESSION['user'] ?? []; }
