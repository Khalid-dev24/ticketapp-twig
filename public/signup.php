<?php
session_start();
require_once 'vendor/autoload.php';

use Twig\Environment;
use Twig\Loader\FilesystemLoader;

$loader = new FilesystemLoader('templates');
$twig = new Environment($loader);

$usersFile = 'users.json';

// Handle signup form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullname = trim($_POST['fullname'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm = $_POST['confirm_password'] ?? '';

    // Validation
    if (empty($fullname) || empty($email) || empty($password) || empty($confirm)) {
        echo $twig->render('signup.twig', ['error' => 'All fields are required']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo $twig->render('signup.twig', ['error' => 'Invalid email address']);
        exit;
    }

    if ($password !== $confirm) {
        echo $twig->render('signup.twig', ['error' => 'Passwords do not match']);
        exit;
    }

    // Load or create users list
    $users = file_exists($usersFile)
        ? json_decode(file_get_contents($usersFile), true)
        : [];

    // Check for existing user
    foreach ($users as $user) {
        if ($user['email'] === $email) {
            echo $twig->render('signup.twig', ['error' => 'User already exists']);
            exit;
        }
    }

    // Save new user
    $users[] = [
        'fullname' => $fullname,
        'email' => $email,
        'password' => password_hash($password, PASSWORD_BCRYPT)
    ];
    file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT));

    // Redirect to login
    header('Location: ?page=login&success=1');
    exit;
}

// Render signup page if not POST
echo $twig->render('signup.twig');
