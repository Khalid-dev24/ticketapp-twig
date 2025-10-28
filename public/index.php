<?php
session_start();
require_once __DIR__ . '/../vendor/autoload.php';

use Twig\Environment;
use Twig\Loader\FilesystemLoader;

$loader = new \Twig\Loader\FilesystemLoader(__DIR__ . '/../templates');
$twig = new Environment($loader);

$page = $_GET['page'] ?? 'home';

// File to store users
$usersFile = __DIR__ . '/users.json';
if (!file_exists($usersFile)) {
    file_put_contents($usersFile, json_encode([]));
}

switch ($page) {

    case 'login':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $email = trim($_POST['email'] ?? '');
            $password = $_POST['password'] ?? '';

            $users = json_decode(file_get_contents($usersFile), true);

            foreach ($users as $user) {
                if ($user['email'] === $email && password_verify($password, $user['password'])) {
                    $_SESSION['user'] = $email;
                    header('Location: ?page=dashboard');
                    exit;
                }
            }

            echo $twig->render('login.twig', ['error' => 'Invalid email or password']);
            exit;
        }

        echo $twig->render('login.twig');
        break;

    case 'signup':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $fullname = trim($_POST['fullname'] ?? '');
            $email = trim($_POST['email'] ?? '');
            $password = $_POST['password'] ?? '';
            $confirm = $_POST['confirm_password'] ?? '';

            if (empty($fullname) || empty($email) || empty($password)) {
                echo $twig->render('signup.twig', ['error' => 'All fields are required']);
                exit;
            }

            if ($password !== $confirm) {
                echo $twig->render('signup.twig', ['error' => 'Passwords do not match']);
                exit;
            }

            $users = json_decode(file_get_contents($usersFile), true);

            foreach ($users as $user) {
                if ($user['email'] === $email) {
                    echo $twig->render('signup.twig', ['error' => 'Email already registered']);
                    exit;
                }
            }

            $users[] = [
                'fullname' => $fullname,
                'email' => $email,
                'password' => password_hash($password, PASSWORD_BCRYPT)
            ];

            file_put_contents($usersFile, json_encode($users));
            header('Location: ?page=login&success=1');
            exit;
        }

        echo $twig->render('signup.twig');
        break;

    case 'dashboard':
        if (!isset($_SESSION['user'])) {
            header('Location: ?page=login');
            exit;
        }

        echo $twig->render('dashboard.twig', [
            'user' => $_SESSION['user']
        ]);
        break;

    case 'tickets':
        if (!isset($_SESSION['user'])) {
            header('Location: ?page=login');
            exit;
        }

        echo $twig->render('tickets.twig');
        break;

    case 'logout':
        session_destroy();
        header('Location: ?page=login');
        exit;

    default:
        echo $twig->render('home.twig');
        break;
}
