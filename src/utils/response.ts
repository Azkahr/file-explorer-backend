export const jsonResponse = (data: unknown, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const errorResponse = (message: string, status = 400) => {
  return jsonResponse({ message }, status);
};
