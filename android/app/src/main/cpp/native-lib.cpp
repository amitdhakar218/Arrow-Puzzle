#include <jni.h>
#include <string>
#include <memory>
#include "GameEngine.hpp"

static std::unique_ptr<ArrowPuzzle::GameEngine> g_engine;

extern "C" {

JNIEXPORT void JNICALL
Java_com_arrowpuzzle_tap_MainActivity_initEngine(JNIEnv *env, jobject /* this */) {
    if (!g_engine) {
        g_engine = std::make_unique<ArrowPuzzle::GameEngine>();
    }
}

JNIEXPORT void JNICALL
Java_com_arrowpuzzle_tap_MainActivity_loadLevel(JNIEnv *env, jobject /* this */, jint levelNum) {
    if (g_engine) {
        g_engine->loadLevel(levelNum);
    }
}

JNIEXPORT jstring JNICALL
Java_com_arrowpuzzle_tap_MainActivity_tapTile(JNIEnv *env, jobject /* this */, jint tileId) {
    if (!g_engine) return env->NewStringUTF("{\"error\":\"Engine not initialized\"}");
    auto res = g_engine->tapTile(tileId);

    std::string json = "{\"success\":" + std::string(res.success ? "true" : "false") +
                       ",\"canExit\":" + std::string(res.canExit ? "true" : "false") +
                       ",\"exitingId\":" + std::to_string(res.exitingArrowId) +
                       ",\"blockedById\":" + std::to_string(res.blockedByArrowId) +
                       ",\"didRotate\":" + std::string(res.didRotate ? "true" : "false") +
                       ",\"message\":\"" + res.message + "\"}";

    return env->NewStringUTF(json.c_str());
}

JNIEXPORT jboolean JNICALL
Java_com_arrowpuzzle_tap_MainActivity_undoMove(JNIEnv *env, jobject /* this */) {
    if (!g_engine) return JNI_FALSE;
    return g_engine->undoLastMove() ? JNI_TRUE : JNI_FALSE;
}

JNIEXPORT jint JNICALL
Java_com_arrowpuzzle_tap_MainActivity_getHint(JNIEnv *env, jobject /* this */) {
    if (!g_engine) return -1;
    auto hint = g_engine->getHintArrowId();
    return hint.has_value() ? hint.value() : -1;
}

JNIEXPORT jboolean JNICALL
Java_com_arrowpuzzle_tap_MainActivity_isLevelCompleted(JNIEnv *env, jobject /* this */) {
    if (!g_engine) return JNI_FALSE;
    return g_engine->isLevelCompleted() ? JNI_TRUE : JNI_FALSE;
}

JNIEXPORT jstring JNICALL
Java_com_arrowpuzzle_tap_MainActivity_getLevelStatusJson(JNIEnv *env, jobject /* this */) {
    if (!g_engine) return env->NewStringUTF("{}");
    return env->NewStringUTF(g_engine->getLevelAsJson().c_str());
}

}
