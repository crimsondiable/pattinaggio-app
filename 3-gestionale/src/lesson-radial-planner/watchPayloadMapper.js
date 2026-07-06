(function () {
  'use strict'

  function buildWatchLessonPayload(lesson) {
    const models = window.LessonRadialModels
    const source = lesson?.type ? models.normalizeEvent(lesson) : models.mapGestionaleLessonToRadialEvent(lesson || {})
    return {
      lessonId: source.id,
      title: source.title,
      startTime: source.startTime,
      endTime: source.endTime,
      durationMinutes: source.durationMinutes,
      locationName: source.locationName,
      studentNames: source.studentNames,
      primaryGoal: source.primaryGoal,
      skills: source.skills,
      checklist: source.checklist.map(item => ({
        id: item.id,
        label: item.label,
        type: item.type,
        done: item.done === true,
      })),
      status: source.status,
      quickActions: source.quickActions,
      updatedAt: source.updatedAt || new Date().toISOString(),
    }
  }

  function buildWatchLessonPayloadJson(lesson) {
    return JSON.stringify(buildWatchLessonPayload(lesson), null, 2)
  }

  window.WatchPayloadMapper = {
    buildWatchLessonPayload,
    buildWatchLessonPayloadJson,
  }

  window.buildWatchLessonPayload = buildWatchLessonPayload
})()
