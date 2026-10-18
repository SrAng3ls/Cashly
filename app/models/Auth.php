<?php
class Auth {
 private PDO $db; public function __construct(){ $this->db=Database::connection(); }
 public function register(string $name,string $email,string $password): bool {
  $q=$this->db->prepare('INSERT INTO users (name,email,password_hash) VALUES (?,?,?)');
  return $q->execute([$name,$email,password_hash($password,PASSWORD_DEFAULT)]);
 }
 public function login(string $email,string $password): bool {
  $q=$this->db->prepare('SELECT id,name,email,password_hash,role,status,phone,avatar,theme FROM users WHERE email=? LIMIT 1'); $q->execute([$email]); $u=$q->fetch();
  if(!$u || !password_verify($password,$u['password_hash']) || $u['status']!=='active') return false;
  unset($u['password_hash']); session_regenerate_id(true); $_SESSION['user']=$u; $this->db->prepare('UPDATE users SET last_login=NOW() WHERE id=?')->execute([$u['id']]); return true;
 }
 public function findByEmail(string $email): ?array { $q=$this->db->prepare('SELECT id,name,email FROM users WHERE email=?'); $q->execute([$email]); return $q->fetch() ?: null; }
 public function resetPassword(int $id,string $password): void { $q=$this->db->prepare('UPDATE users SET password_hash=? WHERE id=?'); $q->execute([password_hash($password,PASSWORD_DEFAULT),$id]); }
}
