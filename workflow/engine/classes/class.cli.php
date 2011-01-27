<?php
/**
 * class.cli.php
 *
 * ProcessMaker Open Source Edition
 * Copyright (C) 2011 Colosa Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * For more information, contact Colosa Inc, 2566 Le Jeune Rd.,
 * Coral Gables, FL, 33134, USA, or email info@colosa.com.
 *
 * @author Alexandre Rosenfeld <alexandre@colosa.com>
 */

class CLI {
  public static $tasks = array();
  public static $currentTask = NULL;

  /**
   * Adds a new task defined by it's name. All other task functions will
   * remember the current task defined here.
   *
   * @param  string $name name of the task, used in the command-line
   */
  public static function taskName($name) {
    self::$currentTask = $name;
    self::$tasks[$name] = array(
      'name' => $name,
      'description' => NULL,
      'args' => array(),
      'function' => NULL,
      'opt' => array('short' => '', 'long' => array())
    );
  }

  /**
   * Adds a description to the current task. The description should contain a
   * one-line description of the command and a few lines of text with more
   * information.
   *
   * @param  string $description task description
   */
  public static function taskDescription($description) {
    assert(self::$currentTask !== NULL);
    self::$tasks[self::$currentTask]["description"] = $description;
  }

  /**
   * Adds an argument to the current task. The options will affect how it is
   * displayed in the help command. Optional will put [] in the argument and
   * multiple will put ... in the end. Arguments are displayed together with
   * the task name in the help command.
   *
   * @param  string $name argument name
   */
  public static function taskArg($name, $optional = true, $multiple = false) {
    assert(self::$currentTask !== NULL);
    self::$tasks[self::$currentTask]["args"][$name] = array(
      'optional' => $optional,
      'multiple' => $multiple
    );
  }

  /**
   * Defines short and long options as used by getopt to the current task.
   *
   * @param  string $short short options
   * @param  array  $long  long options
   */
  public static function taskOpt($short, $long = array()) {
    assert(self::$currentTask !== NULL);
    self::$tasks[self::$currentTask]["opt"] = array('short' => $short, 'long' => $long);
  }

  /**
   * Defines the function to run for the current task.
   *
   * @param  callback $function function to run
   */
  public static function taskRun($function) {
    assert(self::$currentTask !== NULL);
    self::$tasks[self::$currentTask]["function"] = $function;
  }

  /**
   * Displays the help instructions.
   *
   * @param  array $args if defined, the task name should be argument 0
   * @param  array $opts options as returned by getopt
   */
  public static function help($args, $opts) {
    global $argv;
    $scriptName = $argv[0];
    $taskName = $args[0];

    if (!$taskName) {
      echo "usage: $scriptName <task> [options] [args]\n";
      echo "Type '$scriptName help <task-name>' for help on a specific task\n";
      echo "\nAvailable tasks:\n";
      $tasks = array();
      ksort(self::$tasks);
      foreach (self::$tasks as $name => $data) {
        $description = explode("\n", $data['description']);
        $tasks[] = "  $name";
      }
      $tasks = join("\n", $tasks);
      echo $tasks . "\n\n";
    } else {
      $valid_args = array();
      foreach(self::$tasks[$taskName]['args'] as $arg => $data) {
        $arg = strtoupper($arg);
        if ($data['multiple'])
          $arg = "$arg...";
        if ($data['optional'])
          $arg = "[$arg]";
        $valid_args[] = $arg;
      }
      $valid_args = join(" ", $valid_args);
      $description = explode("\n", self::$tasks[$taskName]['description']);
      $taskDescription = trim(array_shift($description));
      $description = trim(implode("\n", $description));
      $message = <<< EOT
$taskName: {$taskDescription}
Usage: $scriptName $taskName $valid_args

  $description

EOT;
      if ($valid_options) {
        $message .= <<< EOT
Options:
$valid_options

EOT;
      }
      echo $message . "\n";
    }
  }

  /**
   * Run the CLI task, which will check which command is specified and run it.
   */
  public static function run() {
    CLI::taskName("help");
    CLI::taskRun(array('self', 'help'));
    global $argv;
    $args = $argv;
    $cliname = array_shift($args);
    $taskName = array_shift($args);
    while ($taskName{0} == '-')
      $taskName = array_shift($args);
    if (!$taskName) {
      self::help();
      return;
    }
    $taskData = NULL;
    foreach (self::$tasks as $name => $data) {
      if (strcasecmp($name, $taskName) === 0) {
        $taskData = $data;
        break;
      }
    }
    G::LoadThirdParty('pear/Console', 'Getopt');
    $short = "h" . $taskData['opt']['short'];
    $long = array_merge(array("help"), $taskData['opt']['long']);
    list($options, $arguments) = Console_GetOpt::getopt2($args, $short, $long);
    call_user_func($taskData['function'], $arguments, $options);
    die();
  }

  /**
   * Returns an information colorized version of the message.
   *
   * @param  string $message the message to colorize
   */
  public static function info($message) {
    return pakeColor::colorize($message, "INFO");
  }

  /**
   * Returns an error colorized version of the message.
   *
   * @param  string $message the message to colorize
   */
  public static function error($message) {
    return pakeColor::colorize($message, "ERROR");
  }

  /**
   * Prompt the user for information.
   *
   * @param  string $message the message to display
   * @return string the text typed by the user
   */
  public static function prompt($message) {
    echo "$message";
    $handle = fopen ("php://stdin","r");
    $line = fgets($handle);
    return $line;
  }

  /**
   * Ask a question of yes or no.
   *
   * @param  string $message the message to display
   * @return bool true if the user choosed no, false otherwise
   */
  public static function question($message) {
    $input = strtolower(self::prompt("$message [Y/n] "));
    return (array_search(trim($input), array("y", "")) !== false);
  }

  /**
   * Display a message to the user. If filename is specified, it will setup
   * a logging file where all messages will be recorded.
   *
   * @param  string $message the message to display
   * @param  string $filename the log file to write messages
   */
  public static function logging($message, $filename = NULL) {
    static $log_file = NULL;
    if (isset($filename)) {
      $log_file = fopen($filename, "a");
      fwrite($log_file, " -- " . date("c") . " " . $message . " --\n");
    } else {
      if (isset($log_file))
        fwrite($log_file, $message);
      echo $message;
    }
  }
}

?>