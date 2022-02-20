import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

const textStyle = TextStyle(fontSize: 20, color: Colors.white);


final liquidPages = [
  Container(
      color: Colors.pinkAccent,
      child: const Center(
        child: Text("Slide 1", style: textStyle),
      )
  ),
  Container(
      color: Colors.blueAccent,
      child: const Center(
        child: Text("Slide 2", style: textStyle),
      )
  ),
  Container(
      color: Colors.deepPurpleAccent,
      child: const Center(
        child: Text("Slide 3", style: textStyle),
      )
  )
];
