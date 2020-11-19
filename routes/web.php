<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
Route::get('/chat',[App\Http\Controllers\ChatController::class,'chat']);
Route::post('/send',[App\Http\Controllers\ChatController::class,'send']);
Route::post('/saveToSession',[App\Http\Controllers\ChatController::class,'saveToSession']);
Route::post('/getOldMessage',[App\Http\Controllers\ChatController::class,'getOldMessage']);
Route::get('/check',function (){
    return session('chat');
});
