<?php
session_start();
require_once 'vendor/autoload.php';

if (!isset($_SESSION['user'])) {
    header('Location: login.php');
    exit;
}

$loader = new \Twig\Loader\FilesystemLoader('templates');
$twig = new \Twig\Environment($loader);

$ticketsFile = 'tickets.json';
$tickets = file_exists($ticketsFile) ? json_decode(file_get_contents($ticketsFile), true) : [];

echo $twig->render('tickets.twig', ['tickets' => $tickets]);
