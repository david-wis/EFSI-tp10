<?php
class DB {
    public static function Connect() {
        $pdo = new PDO("mysql:host=127.0.0.1;dbname=tp10", "root", "");
        return $pdo;
    }

    public static function Disconnect(&$pdo) {
        &$pdo = null;
    }
}

?>