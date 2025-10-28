<?php
session_start();

require_once 'vendor/autoload.php';

$loader = new \Twig\Loader\FilesystemLoader('templates');
$twig = new \Twig\Environment($loader);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    $usersFile = 'users.json';
    if (!file_exists($usersFile)) {
        echo $twig->render('login.twig', ['error' => 'No registered users']);
        exit;
    }

    $users = json_decode(file_get_contents($usersFile), true);

    foreach ($users as $user) {
        if ($user['email'] === $email && password_verify($password, $user['password'])) {
            $_SESSION['user'] = $email;
            header('Location: dashboard.php');
            exit;
        }
    }

    echo $twig->render('login.twig', ['error' => 'Invalid credentials']);
    exit;
}

echo $twig->render('login.twig');
